import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { Icon } from '../design-system'
import { borradorFoto, limpiarBorradorFoto } from '../data/borrador.js'
import { MOMENTOS, etiquetaMomento, momentoPorHora } from '../data/catalogo.js'
import { actualizarRegistro, anadirRegistro, buscarRegistro, useDatos } from '../data/store.js'
import { claveFecha, horaActual } from '../lib/fechas.js'
import { miniatura } from '../lib/imagen.js'
import { casillasNutrientes, sumarNutrientes } from '../lib/nutricion.js'

const soloCifras = (v) => String(v).replace(/[^0-9]/g, '').slice(0, 4)
const idMomento = (label) => MOMENTOS.find((m) => m.label === label)?.id

/**
 * 7 · Revisar comida — artboard FotoResultado.dc.html
 * Con ?editar=<id> corrige una comida ya guardada (desde «12 · Detalle de comida»).
 */
export default function FotoResultado() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { registros } = useDatos()
  const editando = buscarRegistro(registros, params.get('editar'))

  // De dónde salen los datos: la comida que se edita o el análisis recién hecho.
  const [origen] = useState(() =>
    editando
      ? { nombre: editando.nombre, foto: editando.foto, ingredientes: editando.alimentos, hora: editando.hora, momento: idMomento(editando.momento) }
      : borradorFoto.resultado && { ...borradorFoto.resultado, foto: borradorFoto.foto, hora: horaActual(), momento: momentoPorHora() },
  )
  const [momento, setMomento] = useState(() => origen?.momento ?? momentoPorHora())
  const [corrigiendo, setCorrigiendo] = useState(-1)
  const [gramos, setGramos] = useState(() => origen?.ingredientes.map((i) => String(i.gramos)) ?? [])
  const [guardando, setGuardando] = useState(false)

  if (!origen) return <Navigate to="/comida/foto" replace />

  const ingredientes = origen.ingredientes.map((ing, i) => ({ ...ing, gramos: gramos[i] }))
  const totales = sumarNutrientes(ingredientes)
  const alimentos = ingredientes.map((i) => ({ ...i, gramos: Number(i.gramos) || 0 }))

  async function guardar() {
    setGuardando(true)
    if (editando) {
      actualizarRegistro(editando.id, { momento: etiquetaMomento(momento), alimentos, nutrientes: totales })
      navigate(`/registro/${editando.id}`, { replace: true })
      return
    }
    anadirRegistro({
      tipo: 'comida',
      fecha: claveFecha(),
      hora: origen.hora,
      momento: etiquetaMomento(momento),
      nombre: origen.nombre,
      ia: true,
      foto: await miniatura(origen.foto),
      alimentos,
      nutrientes: totales,
    })
    limpiarBorradorFoto()
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
          <Link to="/comida/foto" className="ft-icon-btn boton-44" aria-label="Repetir la foto">
            <Icon name="atras" />
          </Link>
        )}
        <h1 className="titulo-seccion">Revisa la comida</h1>
      </header>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {origen.foto ? (
          <img
            src={origen.foto}
            alt="Miniatura de la foto"
            style={{ width: 64, height: 64, flex: 'none', borderRadius: 8, objectFit: 'cover', background: '#232826' }}
          />
        ) : (
          <span className="ft-thumb" style={{ width: 64, height: 64 }}>
            <Icon name="comida" />
          </span>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <p className="subtitulo">{origen.nombre}</p>
          <p className="texto-pequeno" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="ft-ai-tag">IA</span>Estimación · {origen.hora}
          </p>
        </div>
      </div>

      <fieldset className="grupo-opciones">
        <legend>Momento del día</legend>
        <div className="opciones">
          {MOMENTOS.map((o) => (
            <label key={o.id} className={momento === o.id ? 'opcion activa' : 'opcion'}>
              <input type="radio" name="momento" value={o.id} checked={momento === o.id} onChange={() => setMomento(o.id)} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <section aria-labelledby="ing-titulo" className="seccion">
        <h2 id="ing-titulo" className="etiqueta-seccion">Ingredientes detectados</h2>
        <div className="tarjeta" style={{ padding: '0 12px 0 16px' }}>
          {ingredientes.map((ing, i) => (
            <div
              key={ing.nombre}
              style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, borderTop: i ? '1px solid var(--line)' : 0 }}
            >
              <span style={{ flex: 1 }}>{ing.nombre}</span>
              {corrigiendo === i ? (
                <>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--ink-muted)' }}>
                    <span className="solo-lectores">Gramos de {ing.nombre}</span>
                    <input
                      className="gramos"
                      type="text"
                      inputMode="numeric"
                      autoFocus
                      value={ing.gramos}
                      onChange={(e) => setGramos((g) => g.map((v, j) => (j === i ? soloCifras(e.target.value) : v)))}
                    />
                    g
                  </label>
                  <button type="button" className="ft-link" onClick={() => setCorrigiendo(-1)}>
                    Listo
                  </button>
                </>
              ) : (
                <>
                  <span className="cifras" style={{ fontSize: 14, color: 'var(--ink-muted)' }}>≈ {ing.gramos} g</span>
                  <button
                    type="button"
                    className="ft-icon-btn"
                    style={{ width: 36, height: 36, borderWidth: 1.5 }}
                    aria-label={`Corregir la cantidad de ${ing.nombre.toLowerCase()}`}
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
        <button type="button" className="ft-btn ft-btn-primary boton-ancho" onClick={guardar} disabled={guardando}>
          Guardar comida
        </button>
      </div>
    </div>
  )
}
