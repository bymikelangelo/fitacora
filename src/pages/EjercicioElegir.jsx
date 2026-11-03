import { useState } from 'react'
import { Link } from 'react-router'
import { Icon } from '../design-system'
import { EJERCICIOS, TIPOS_EJERCICIO, normalizar, subtituloEjercicio } from '../data/catalogo.js'
import { useDatos } from '../data/store.js'
import { sugerirEjercicio } from '../services/ai.js'

const minusculaInicial = (s) => s.charAt(0).toLowerCase() + s.slice(1)

/** 10 · Elegir ejercicio — artboard EjercicioElegir.dc.html */
export default function EjercicioElegir() {
  const { registros } = useDatos()
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState('todos')
  const [sugerencia] = useState(() => sugerirEjercicio(registros))

  const lista = EJERCICIOS.filter(
    (e) => (tipo === 'todos' || e.tipo === tipo) && (!q || normalizar(`${e.nombre} ${subtituloEjercicio(e)}`).includes(normalizar(q))),
  ).slice(0, 6)

  return (
    <div className="pantalla pantalla-form">
      <header className="cabecera">
        <Link to="/" className="ft-icon-btn boton-44" aria-label="Volver al inicio">
          <Icon name="atras" />
        </Link>
        <h1 className="titulo-seccion">Añadir ejercicio</h1>
      </header>

      <div className="buscador">
        <label htmlFor="q" className="solo-lectores">Buscar un ejercicio</label>
        <span className="buscador-lupa" aria-hidden="true">
          <Icon name="buscar" />
        </span>
        <input id="q" className="campo" type="search" placeholder="Busca un ejercicio" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <fieldset className="grupo-opciones" style={{ gap: 0 }}>
        <legend className="solo-lectores">Tipo de ejercicio</legend>
        <div className="opciones">
          {TIPOS_EJERCICIO.map((o) => (
            <label key={o.id} className={tipo === o.id ? 'opcion activa' : 'opcion'}>
              <input type="radio" name="tipo" value={o.id} checked={tipo === o.id} onChange={() => setTipo(o.id)} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {sugerencia && (
        <section
          aria-labelledby="ia-titulo"
          style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px', background: 'var(--ai)', color: 'var(--on-fill)', borderRadius: 'var(--radius-md)' }}
        >
          <h2 id="ia-titulo" className="etiqueta-seccion" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="ft-ai-tag">IA</span>Sugerencia
          </h2>
          <p style={{ margin: 0 }}>Esta semana no has registrado ejercicios de {sugerencia.grupo.toLowerCase()}.</p>
          <Link to={`/ejercicio/${sugerencia.id}`} className="ft-link" style={{ alignSelf: 'flex-start' }}>
            Ver {minusculaInicial(sugerencia.nombre)}
          </Link>
        </section>
      )}

      <section aria-labelledby="lista-titulo" className="seccion">
        <h2 id="lista-titulo" className="etiqueta-seccion">{q ? 'Resultados' : 'Frecuentes'}</h2>
        <div className="tarjeta" style={{ padding: '0 16px' }}>
          {lista.map((e, i) => (
            <Link
              key={e.id}
              to={`/ejercicio/${e.id}`}
              className="fila-enlace"
              style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 52, borderTop: i ? '1px solid var(--line)' : 0, textDecoration: 'none', color: 'var(--ink)' }}
            >
              <span style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <Icon name={e.icono} size={e.icono.startsWith('m-') ? 32 : 20} />
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span>{e.nombre}</span>
                <span className="texto-pequeno">{subtituloEjercicio(e)}</span>
              </span>
              <Icon name="adelante" />
            </Link>
          ))}
          {lista.length === 0 && (
            <p className="ft-empty" style={{ margin: 0 }}>
              No encontramos «{q}». Prueba con otro nombre.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
