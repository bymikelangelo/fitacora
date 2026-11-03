import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { Icon } from '../design-system'
import { ALIMENTOS, etiquetaMomento } from '../data/catalogo.js'
import { anadirRegistro } from '../data/store.js'
import { claveFecha, horaActual } from '../lib/fechas.js'
import { casillasNutrientes, sumarNutrientes } from '../lib/nutricion.js'

const soloCifras = (v) => String(v).replace(/[^0-9]/g, '').slice(0, 4)

/** 9 · Revisar comida a mano — artboard ManoRevisar.dc.html */
export default function ManoRevisar() {
  const navigate = useNavigate()
  const previo = useLocation().state
  const [nombre, setNombre] = useState(() => previo?.nombre ?? '')
  const [gramos, setGramos] = useState(() => previo?.gramos ?? {})

  if (!previo?.sel?.length) return <Navigate to="/comida/buscar" replace />

  const alimentos = previo.sel
    .map((id) => ALIMENTOS.find((a) => a.id === id))
    .filter(Boolean)
    .map((a) => ({ ...a, gramos: gramos[a.id] ?? String(a.gramos) }))
  const totales = sumarNutrientes(alimentos)

  // Vuelve a «Buscar alimentos» conservando lo elegido y lo escrito.
  const volverABuscar = () =>
    navigate('/comida/buscar', { state: { sel: previo.sel, momento: previo.momento, gramos, nombre } })

  function guardar() {
    anadirRegistro({
      tipo: 'comida',
      fecha: claveFecha(),
      hora: horaActual(),
      momento: etiquetaMomento(previo.momento),
      nombre: nombre.trim() || alimentos.map((a) => a.nombre).join(', '),
      ia: false,
      alimentos: alimentos.map((a) => ({ nombre: a.nombre, gramos: Number(a.gramos) || 0 })),
      nutrientes: totales,
    })
    navigate('/')
  }

  return (
    <div className="pantalla pantalla-form">
      <header className="cabecera">
        <button type="button" className="ft-icon-btn boton-44" aria-label="Volver a buscar alimentos" onClick={volverABuscar}>
          <Icon name="atras" />
        </button>
        <h1 className="titulo-seccion">Revisa la comida</h1>
      </header>

      <div className="seccion">
        <label htmlFor="nombre-comida" style={{ fontSize: 14, lineHeight: '20px' }}>
          Nombre de la comida <span style={{ color: 'var(--ink-muted)' }}>(opcional)</span>
        </label>
        <input
          id="nombre-comida"
          className="campo"
          type="text"
          placeholder="Pollo con arroz y ensalada"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <section aria-labelledby="ali-titulo" className="seccion">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h2 id="ali-titulo" className="etiqueta-seccion">Alimentos · {etiquetaMomento(previo.momento)}</h2>
          <button type="button" className="ft-link" onClick={volverABuscar}>
            Añadir otro
          </button>
        </div>
        <div className="tarjeta" style={{ padding: '0 16px' }}>
          {alimentos.map((a, i) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 52, borderTop: i ? '1px solid var(--line)' : 0 }}>
              <label htmlFor={`g-${a.id}`} style={{ flex: 1 }}>{a.nombre}</label>
              <input
                id={`g-${a.id}`}
                className="gramos"
                style={{ height: 36 }}
                type="text"
                inputMode="numeric"
                value={a.gramos}
                onChange={(e) => setGramos((g) => ({ ...g, [a.id]: soloCifras(e.target.value) }))}
              />
              <span aria-hidden="true" style={{ width: 14, fontSize: 14, color: 'var(--ink-muted)' }}>g</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="nut-titulo" className="seccion">
        <h2 id="nut-titulo" className="etiqueta-seccion">Nutrientes</h2>
        <dl className="nutrientes">
          {casillasNutrientes(totales, false).map((n) => (
            <div key={n.label}>
              <dt>
                <Icon name={n.icon} size={18} />
                {n.label}
              </dt>
              <dd>{n.valor}</dd>
            </div>
          ))}
        </dl>
        <p className="texto-pequeno">Valores medios por alimento. Referencia: BEDCA.</p>
      </section>

      <div className="pie">
        <button type="button" className="ft-btn ft-btn-primary boton-ancho" onClick={guardar}>
          Guardar comida
        </button>
      </div>
    </div>
  )
}
