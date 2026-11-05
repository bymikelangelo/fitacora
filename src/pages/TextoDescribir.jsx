import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Icon } from '../design-system'
import { pareceEjercicio } from '../lib/texto.js'
import './Texto.css'

const EJEMPLOS = ['Ensalada de pasta con atún', 'Un zumo de naranja', 'He salido a correr media hora', '3 series de 10 sentadillas']

/** 14 · Describir con texto — artboard TextoDescribir.dc.html */
export default function TextoDescribir() {
  const navigate = useNavigate()
  const previo = useLocation().state
  const [texto, setTexto] = useState(() => previo?.texto ?? '')
  const hayTexto = texto.trim().length > 0

  function analizar() {
    if (hayTexto) navigate('/texto/revisar', { state: { texto: texto.trim() } })
  }

  return (
    <div className="pantalla pantalla-form" style={{ gap: 20 }}>
      <header className="cabecera">
        <Link to="/" className="ft-icon-btn boton-44" aria-label="Volver al inicio">
          <Icon name="atras" />
        </Link>
        <h1 className="titulo-seccion">Describe tu registro</h1>
      </header>

      <div className="seccion">
        <label htmlFor="texto" style={{ fontSize: 14, lineHeight: '20px' }}>
          ¿Qué has comido, bebido o entrenado?
        </label>
        <textarea
          id="texto"
          className="texto-libre"
          placeholder="Por ejemplo: un bocadillo de tortilla y un café con leche"
          maxLength={500}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>

      <section aria-labelledby="ej-titulo" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h2 id="ej-titulo" className="etiqueta-seccion" style={{ color: 'var(--ink-muted)' }}>
          Prueba con un ejemplo
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EJEMPLOS.map((e) => (
            <button key={e} type="button" className="ejemplo" onClick={() => setTexto(e)}>
              {e}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="ia-titulo" className="caja-ia" style={{ gap: 6, padding: '14px 16px' }}>
        <h2 id="ia-titulo" className="etiqueta-seccion" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="ft-ai-tag">IA</span>Cómo funciona
        </h2>
        <p style={{ margin: 0 }}>
          La IA detecta si es comida, bebida o ejercicio y estima las cantidades. Podrás revisarlo todo antes de guardar.
        </p>
      </section>

      <div className="pie" style={{ gap: 8 }}>
        <p className="texto-pequeno" style={{ textAlign: 'center' }}>
          {!hayTexto
            ? 'Escribe una descripción para analizarla.'
            : pareceEjercicio(texto)
              ? 'Parece un ejercicio.'
              : 'Parece una comida o bebida.'}
        </p>
        <button type="button" className="ft-btn ft-btn-primary boton-ancho" disabled={!hayTexto} onClick={analizar}>
          <Icon name="ia" />
          Analizar
        </button>
      </div>
    </div>
  )
}
