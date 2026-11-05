import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router'
import { Icon } from '../design-system'
import { CATEGORIAS, GRUPOS, INTENSIDADES, MOMENTOS, etiquetaMomento, momentoPorHora } from '../data/catalogo.js'
import { actualizarRegistro, anadirRegistro, buscarRegistro, useDatos } from '../data/store.js'
import { claveFecha, horaActual } from '../lib/fechas.js'
import { casillasNutrientes, sumarNutrientes } from '../lib/nutricion.js'
import { pareceEjercicio } from '../lib/texto.js'
import { ErrorIA, analizarTexto } from '../services/ai.js'
import './Texto.css'

const soloCifras = (v) => String(v).replace(/[^0-9]/g, '').slice(0, 4)
const MINUTOS_POR_SERIE = 5

/* ───────── De la respuesta de la IA (o de un registro guardado) al estado de la pantalla ───────── */

function comidaDesdeIA(c) {
  return {
    nombre: c.nombre,
    momento: c.momento ?? momentoPorHora(),
    items: c.alimentos.map((a) => ({
      nombre: a.nombre, cantidad: String(a.cantidad), unidad: a.unidad,
      kcal: a.kcal, p: a.proteinas, h: a.hidratos, g: a.grasas, f: a.fibra,
    })),
  }
}

function ejercicioDesdeIA(e) {
  return {
    nombre: e.nombre,
    categoria: e.categoria,
    grupo: e.grupo,
    intensidad: e.intensidad,
    series: e.series ?? 3,
    repeticiones: e.repeticiones ?? 10,
    carga: e.carga_kg ?? 0,
    duracion: e.duracion_min ?? 30,
  }
}

function desdeRegistro(r) {
  if (r.tipo === 'comida') {
    return {
      tipo: 'comida',
      hora: r.hora,
      comida: {
        nombre: r.nombre,
        momento: MOMENTOS.find((m) => m.label === r.momento)?.id ?? momentoPorHora(),
        items: (r.alimentos ?? []).map((a) => ({ ...a, cantidad: String(a.gramos), unidad: a.unidad ?? 'g' })),
      },
    }
  }
  return {
    tipo: 'ejercicio',
    hora: r.hora,
    ejercicio: {
      nombre: r.nombre, categoria: r.categoria, grupo: r.grupoId, intensidad: r.intensidad ?? null,
      series: r.series ?? 3, repeticiones: r.repeticiones ?? 10, carga: r.carga ?? 0, duracion: r.duracion ?? 30,
    },
  }
}

/**
 * 15 · Revisar comida o bebida y 16 · Revisar ejercicio — artboards TextoComida y TextoEjercicio.
 * Envía la descripción al Worker y, según el tipo que devuelve la IA, muestra una u otra revisión.
 * Con ?editar=<id> corrige un registro hecho con texto (desde el detalle del registro).
 */
export default function TextoRevisar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { registros } = useDatos()
  const editando = buscarRegistro(registros, params.get('editar'))
  const texto = editando ? editando.descripcion : location.state?.texto

  // estado: { fase: 'analizando' | 'listo' | 'error', tipo, comida, ejercicio, hora, error }
  const [estado, setEstado] = useState(() =>
    editando ? { fase: 'listo', ...desdeRegistro(editando) } : { fase: 'analizando' },
  )
  const [corrigiendo, setCorrigiendo] = useState(-1)

  useEffect(() => {
    if (editando || !texto) return
    let vivo = true
    analizarTexto(texto)
      .then((r) => {
        if (!vivo) return
        if (r.tipo === 'comida') setEstado({ fase: 'listo', tipo: 'comida', hora: horaActual(), comida: comidaDesdeIA(r.comida) })
        else if (r.tipo === 'ejercicio') setEstado({ fase: 'listo', tipo: 'ejercicio', hora: horaActual(), ejercicio: ejercicioDesdeIA(r.ejercicio) })
        else setEstado({ fase: 'error', error: 'No hemos reconocido ninguna comida, bebida ni ejercicio. Prueba a describirlo de otra forma.' })
      })
      .catch((e) => vivo && setEstado({ fase: 'error', error: e instanceof ErrorIA ? e.message : 'No se ha podido analizar la descripción.' }))
    return () => {
      vivo = false
    }
    // Solo se analiza una vez al entrar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!texto) return <Navigate to={editando ? `/registro/${editando.id}` : '/texto'} replace />

  // Mientras analiza, el título sigue la pista de la pantalla anterior; luego, lo que diga la IA.
  const esEjercicio = estado.fase === 'listo' ? estado.tipo === 'ejercicio' : pareceEjercicio(texto)
  const cambiarComida = (cambios) => setEstado((s) => ({ ...s, comida: { ...s.comida, ...cambios } }))
  const cambiarEjercicio = (cambios) => setEstado((s) => ({ ...s, ejercicio: { ...s.ejercicio, ...cambios } }))

  function guardar() {
    let datos
    if (estado.tipo === 'comida') {
      const c = estado.comida
      const items = c.items.map((i) => ({ ...i, gramos: Number(i.cantidad) || 0 }))
      datos = {
        tipo: 'comida',
        momento: etiquetaMomento(c.momento),
        nombre: c.nombre,
        alimentos: items.map(({ nombre, gramos, unidad, kcal, p, h, g, f }) => ({ nombre, gramos, unidad, kcal, p, h, g, f })),
        nutrientes: sumarNutrientes(items),
      }
    } else {
      const e = estado.ejercicio
      const fuerza = e.categoria === 'fuerza'
      datos = {
        tipo: 'ejercicio',
        hora: /^\d{2}:\d{2}$/.test(estado.hora) ? estado.hora : horaActual(),
        ejercicioId: null,
        nombre: e.nombre,
        grupo: GRUPOS[e.grupo],
        grupoId: e.grupo,
        icono: `m-${e.grupo}`,
        categoria: e.categoria,
        intensidad: e.intensidad,
        ...(fuerza
          ? { series: e.series, repeticiones: e.repeticiones, carga: e.carga, minutos: e.series * MINUTOS_POR_SERIE }
          : { duracion: e.duracion, minutos: e.duracion }),
      }
    }
    if (editando) {
      actualizarRegistro(editando.id, datos)
      navigate(`/registro/${editando.id}`, { replace: true })
      return
    }
    anadirRegistro({ fecha: claveFecha(), hora: estado.hora, ia: true, origen: 'texto', descripcion: texto, ...datos })
    navigate('/')
  }

  return (
    <div className="pantalla pantalla-form">
      <header className="cabecera">
        {editando ? (
          <Link to={`/registro/${editando.id}`} className="ft-icon-btn boton-44" aria-label="Volver sin guardar">
            <Icon name="atras" />
          </Link>
        ) : (
          <Link to="/texto" state={{ texto }} className="ft-icon-btn boton-44" aria-label="Volver a la descripción">
            <Icon name="atras" />
          </Link>
        )}
        <h1 className="titulo-seccion">{esEjercicio ? 'Revisa el ejercicio' : 'Revisa la comida'}</h1>
      </header>

      <blockquote className="cita">
        <p className="texto-pequeno">Has escrito</p>
        <p>«{texto}»</p>
      </blockquote>

      {estado.fase === 'analizando' && (
        <section aria-live="polite" className="caja-ia" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Icon name="ia" />
          <p style={{ margin: 0 }}>Analizando tu descripción…</p>
        </section>
      )}

      {estado.fase === 'error' && (
        <p role="alert" className="texto-pequeno">
          {estado.error}
        </p>
      )}

      {estado.fase === 'listo' && estado.tipo === 'comida' && (
        <RevisarComida
          comida={estado.comida}
          hora={estado.hora}
          corrigiendo={corrigiendo}
          setCorrigiendo={setCorrigiendo}
          cambiar={cambiarComida}
          onGuardar={guardar}
        />
      )}

      {estado.fase === 'listo' && estado.tipo === 'ejercicio' && (
        <RevisarEjercicio
          ejercicio={estado.ejercicio}
          hora={estado.hora}
          cambiar={cambiarEjercicio}
          cambiarHora={(hora) => setEstado((s) => ({ ...s, hora }))}
          onGuardar={guardar}
        />
      )}
    </div>
  )
}

/* ───────── 15 · Revisar comida o bebida ───────── */

function RevisarComida({ comida, hora, corrigiendo, setCorrigiendo, cambiar, onGuardar }) {
  const totales = sumarNutrientes(comida.items.map((i) => ({ ...i, gramos: i.cantidad })))
  const cambiarCantidad = (i, valor) =>
    cambiar({ items: comida.items.map((it, j) => (j === i ? { ...it, cantidad: soloCifras(valor) } : it)) })

  return (
    <>
      <p className="texto-pequeno" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="ft-ai-tag">IA</span>Interpretado por la IA · {hora}
      </p>

      <fieldset className="grupo-opciones" style={{ gap: 0 }}>
        <legend>Momento del día</legend>
        <div className="opciones">
          {MOMENTOS.map((o) => (
            <label key={o.id} className={comida.momento === o.id ? 'opcion activa' : 'opcion'}>
              <input type="radio" name="momento" value={o.id} checked={comida.momento === o.id} onChange={() => cambiar({ momento: o.id })} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <section aria-labelledby="ali-titulo" className="seccion">
        <h2 id="ali-titulo" className="etiqueta-seccion">Alimentos y bebidas detectados</h2>
        <div className="tarjeta" style={{ padding: '0 12px 0 16px' }}>
          {comida.items.map((it, i) => (
            <div key={`${it.nombre}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, borderTop: i ? '1px solid var(--line)' : 0 }}>
              <span style={{ flex: 1 }}>{it.nombre}</span>
              {corrigiendo === i ? (
                <>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--ink-muted)' }}>
                    <span className="solo-lectores">Cantidad de {it.nombre}</span>
                    <input className="gramos" type="text" inputMode="numeric" autoFocus value={it.cantidad} onChange={(e) => cambiarCantidad(i, e.target.value)} />
                    {it.unidad}
                  </label>
                  <button type="button" className="ft-link" onClick={() => setCorrigiendo(-1)}>
                    Listo
                  </button>
                </>
              ) : (
                <>
                  <span className="cifras" style={{ fontSize: 14, color: 'var(--ink-muted)' }}>
                    ≈ {it.cantidad} {it.unidad}
                  </span>
                  <button
                    type="button"
                    className="ft-icon-btn"
                    style={{ width: 36, height: 36, borderWidth: 1.5 }}
                    aria-label={`Corregir la cantidad de ${it.nombre.toLowerCase()}`}
                    onClick={() => setCorrigiendo(i)}
                  >
                    <Icon name="editar" size={18} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="nut-titulo" className="seccion">
        <h2 id="nut-titulo" className="etiqueta-seccion">Nutrientes estimados</h2>
        <dl className="nutrientes">
          {casillasNutrientes(totales, true).map((n) => (
            <div key={n.label}>
              <dt>
                <Icon name={n.icon} size={18} />
                {n.label}
              </dt>
              <dd>{n.valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="pie">
        <button type="button" className="ft-btn ft-btn-primary boton-ancho" onClick={onGuardar}>
          Guardar comida
        </button>
      </div>
    </>
  )
}

/* ───────── 16 · Revisar ejercicio ───────── */

function Menos() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M5.5 12h13" />
    </svg>
  )
}

function RevisarEjercicio({ ejercicio: e, hora, cambiar, cambiarHora, onGuardar }) {
  const fuerza = e.categoria === 'fuerza'
  const paso = (clave, d, min, max) => () => cambiar({ [clave]: Math.max(min, Math.min(max, (e[clave] || 0) + d)) })
  const filas = fuerza
    ? [
        { icon: 'series', label: 'Series', valor: String(e.series), menos: paso('series', -1, 1, 50), mas: paso('series', 1, 1, 50), menosLabel: 'Una serie menos', masLabel: 'Una serie más' },
        { icon: 'fuerza', label: 'Repeticiones', valor: String(e.repeticiones), menos: paso('repeticiones', -1, 1, 500), mas: paso('repeticiones', 1, 1, 500), menosLabel: 'Una repetición menos', masLabel: 'Una repetición más' },
        { icon: 'ejercicio', label: 'Carga', valor: `${e.carga} kg`, menos: paso('carga', -1, 0, 500), mas: paso('carga', 1, 0, 500), menosLabel: 'Un kilo menos', masLabel: 'Un kilo más' },
      ]
    : [
        { icon: 'duracion', label: 'Duración', valor: `${e.duracion} min`, menos: paso('duracion', -5, 5, 600), mas: paso('duracion', 5, 5, 600), menosLabel: 'Cinco minutos menos', masLabel: 'Cinco minutos más' },
      ]

  return (
    <>
      <p className="texto-pequeno" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="ft-ai-tag">IA</span>Interpretado por la IA
      </p>

      <div className="tarjeta" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
        <Icon name={`m-${e.grupo}`} size={48} label={`Grupo muscular: ${GRUPOS[e.grupo].toLowerCase()}`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p className="subtitulo">{e.nombre}</p>
          <p className="texto-pequeno">
            {CATEGORIAS[e.categoria]} · {GRUPOS[e.grupo]}
          </p>
        </div>
      </div>

      <fieldset className="grupo-opciones" style={{ gap: 0 }}>
        <legend>Intensidad</legend>
        <div className="opciones opciones-3">
          {INTENSIDADES.map((o) => (
            <label key={o.id} className={e.intensidad === o.id ? 'opcion activa' : 'opcion'}>
              <input type="radio" name="intensidad" value={o.id} checked={e.intensidad === o.id} onChange={() => cambiar({ intensidad: o.id })} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="tarjeta" style={{ padding: '0 16px' }}>
        {filas.map((c, i) => (
          <div key={c.label} role="group" aria-label={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 60, borderTop: i ? '1px solid var(--line)' : 0 }}>
            <Icon name={c.icon} />
            <span style={{ flex: 1 }}>{c.label}</span>
            <button type="button" className="ft-icon-btn boton-44" aria-label={c.menosLabel} onClick={c.menos}>
              <Menos />
            </button>
            <span className="cifras" aria-live="polite" style={{ minWidth: 72, textAlign: 'center', fontSize: 20, lineHeight: '26px' }}>
              {c.valor}
            </span>
            <button type="button" className="ft-icon-btn boton-44" aria-label={c.masLabel} onClick={c.mas}>
              <Icon name="anadir" />
            </button>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 60, borderTop: '1px solid var(--line)' }}>
          <Icon name="calendario" />
          <label htmlFor="hora" style={{ flex: 1 }}>Hora</label>
          <input
            id="hora"
            className="campo cifras"
            style={{ width: 96, height: 44, textAlign: 'center', borderRadius: 8 }}
            type="text"
            inputMode="numeric"
            value={hora}
            onChange={(ev) => cambiarHora(ev.target.value.slice(0, 5))}
          />
        </div>
      </div>

      <div className="pie">
        <button type="button" className="ft-btn ft-btn-primary boton-ancho" onClick={onGuardar}>
          Guardar ejercicio
        </button>
      </div>
    </>
  )
}
