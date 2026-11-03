import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Icon } from '../design-system'
import { ALIMENTOS, MOMENTOS, kcalRacion, momentoPorHora, normalizar } from '../data/catalogo.js'

/**
 * 8 · Buscar alimentos — artboard ManoBuscar.dc.html
 * Si vuelve desde «Revisar» (Añadir otro), recupera lo elegido.
 */
export default function ManoBuscar() {
  const navigate = useNavigate()
  const previo = useLocation().state ?? {}
  const [q, setQ] = useState('')
  const [momento, setMomento] = useState(() => previo.momento ?? momentoPorHora())
  const [sel, setSel] = useState(() => previo.sel ?? [])

  const lista = ALIMENTOS.filter((a) => !q || normalizar(a.nombre).includes(normalizar(q))).slice(0, 6)
  const kcal = ALIMENTOS.filter((a) => sel.includes(a.id)).reduce((s, a) => s + kcalRacion(a), 0)
  const resumen =
    sel.length === 0
      ? 'Añade al menos un alimento.'
      : `${sel.length === 1 ? '1 alimento' : `${sel.length} alimentos`} · ≈ ${kcal} kcal`

  const alternar = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  function continuar() {
    if (!sel.length) return
    navigate('/comida/revisar', { state: { ...previo, sel, momento } })
  }

  return (
    <div className="pantalla pantalla-form">
      <header className="cabecera">
        <Link
          to={previo.editarId ? `/registro/${previo.editarId}` : '/'}
          className="ft-icon-btn boton-44"
          aria-label={previo.editarId ? 'Volver sin guardar' : 'Volver al inicio'}
        >
          <Icon name="atras" />
        </Link>
        <h1 className="titulo-seccion">Añadir comida</h1>
      </header>

      <div className="buscador">
        <label htmlFor="q" className="solo-lectores">Buscar un alimento</label>
        <span className="buscador-lupa" aria-hidden="true">
          <Icon name="buscar" />
        </span>
        <input id="q" className="campo" type="search" placeholder="Busca un alimento" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <fieldset className="grupo-opciones" style={{ gap: 0 }}>
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

      <section aria-labelledby="lista-titulo" className="seccion" style={{ minHeight: 0 }}>
        <h2 id="lista-titulo" className="etiqueta-seccion">{q ? 'Resultados' : 'Frecuentes'}</h2>
        <div className="tarjeta" style={{ padding: '0 12px 0 16px' }}>
          {lista.map((a, i) => {
            const on = sel.includes(a.id)
            return (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, borderTop: i ? '1px solid var(--line)' : 0 }}>
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <span>{a.nombre}</span>
                  <span className="texto-pequeno cifras">
                    {a.racion} · ≈ {kcalRacion(a)} kcal
                  </span>
                </span>
                <button
                  type="button"
                  className="ft-icon-btn"
                  aria-pressed={on}
                  aria-label={`${on ? 'Quitar' : 'Añadir'} ${a.nombre.toLowerCase()}`}
                  onClick={() => alternar(a.id)}
                  style={{ width: 40, height: 40, flex: 'none', background: on ? 'var(--brand)' : undefined }}
                >
                  <Icon name={on ? 'cerrar' : 'anadir'} />
                </button>
              </div>
            )
          })}
          {lista.length === 0 && (
            <p className="ft-empty" style={{ margin: 0 }}>
              No encontramos «{q}». Prueba con otro nombre.
            </p>
          )}
        </div>
      </section>

      <div className="pie" style={{ gap: 8 }}>
        <p className="texto-pequeno cifras" style={{ textAlign: 'center' }}>{resumen}</p>
        <button type="button" className="ft-btn ft-btn-primary boton-ancho" onClick={continuar}>
          Continuar
        </button>
      </div>
    </div>
  )
}
