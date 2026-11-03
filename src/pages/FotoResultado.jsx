import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { Icon } from '../design-system'
import { borradorFoto, limpiarBorradorFoto } from '../data/borrador.js'
import { MOMENTOS, etiquetaMomento, momentoPorHora } from '../data/catalogo.js'
import { anadirRegistro } from '../data/store.js'
import { claveFecha, horaActual } from '../lib/fechas.js'
import { miniatura } from '../lib/imagen.js'
import { casillasNutrientes, sumarNutrientes } from '../lib/nutricion.js'

const soloCifras = (v) => String(v).replace(/[^0-9]/g, '').slice(0, 4)

/** 7 · Revisar comida — artboard FotoResultado.dc.html */
export default function FotoResultado() {
  const navigate = useNavigate()
  const resultado = borradorFoto.resultado
  const [momento, setMomento] = useState(momentoPorHora)
  const [hora] = useState(() => horaActual())
  const [editando, setEditando] = useState(-1)
  const [gramos, setGramos] = useState(() => resultado?.ingredientes.map((i) => String(i.gramos)) ?? [])
  const [guardando, setGuardando] = useState(false)

  if (!resultado || !borradorFoto.foto) return <Navigate to="/comida/foto" replace />

  const ingredientes = resultado.ingredientes.map((ing, i) => ({ ...ing, gramos: gramos[i] }))
  const totales = sumarNutrientes(ingredientes)

  async function guardar() {
    setGuardando(true)
    anadirRegistro({
      tipo: 'comida',
      fecha: claveFecha(),
      hora,
      momento: etiquetaMomento(momento),
      nombre: resultado.nombre,
      ia: true,
      foto: await miniatura(borradorFoto.foto),
      alimentos: ingredientes.map((i) => ({ nombre: i.nombre, gramos: Number(i.gramos) || 0 })),
      nutrientes: totales,
    })
    limpiarBorradorFoto()
    navigate('/')
  }

  return (
    <div className="pantalla pantalla-form">
      <header className="cabecera">
        <Link to="/comida/foto" className="ft-icon-btn boton-44" aria-label="Repetir la foto">
          <Icon name="atras" />
        </Link>
        <h1 className="titulo-seccion">Revisa la comida</h1>
      </header>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img
          src={borradorFoto.foto}
          alt="Miniatura de la foto"
          style={{ width: 64, height: 64, flex: 'none', borderRadius: 8, objectFit: 'cover', background: '#232826' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <p className="subtitulo">{resultado.nombre}</p>
          <p className="texto-pequeno" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="ft-ai-tag">IA</span>Estimación · {hora}
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
              {editando === i ? (
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
                  <button type="button" className="ft-link" onClick={() => setEditando(-1)}>
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
                    onClick={() => setEditando(i)}
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
