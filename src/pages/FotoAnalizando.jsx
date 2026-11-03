import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { Icon } from '../design-system'
import { borradorFoto } from '../data/borrador.js'
import { analizarFoto } from '../services/ai.js'

const PASOS = ['Identificando los alimentos', 'Estimando las cantidades', 'Calculando los nutrientes']

/** 6 · Analizando — artboard FotoAnalizando.dc.html */
export default function FotoAnalizando() {
  const [paso, setPaso] = useState(0)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(false)
  const foto = borradorFoto.foto

  useEffect(() => {
    if (!foto) return
    const t = setInterval(() => setPaso((p) => (p >= 3 ? p : p + 1)), 900)
    let vivo = true
    analizarFoto(foto)
      .then((r) => {
        if (!vivo) return
        borradorFoto.resultado = r
        setResultado(r)
      })
      .catch(() => vivo && setError(true))
    return () => {
      vivo = false
      clearInterval(t)
    }
  }, [foto])

  if (!foto) return <Navigate to="/comida/foto" replace />

  const listo = paso >= 3 && !!resultado

  return (
    <div className="pantalla pantalla-form" style={{ gap: 20, paddingBottom: 32 }}>
      <header className="cabecera">
        <Link to="/comida/foto" className="ft-icon-btn boton-44" aria-label="Volver a la cámara">
          <Icon name="atras" />
        </Link>
        <h1 className="titulo-seccion">Tu foto</h1>
      </header>

      <img
        src={foto}
        alt="La foto del plato que acabas de hacer"
        style={{ height: 300, width: '100%', objectFit: 'cover', borderRadius: 14, background: '#232826', display: 'block' }}
      />

      <section
        aria-live="polite"
        aria-labelledby="ia-titulo"
        style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, background: 'var(--ai)', color: 'var(--on-fill)', borderRadius: 'var(--radius-md)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="ia" />
          <h2 id="ia-titulo" className="subtitulo">
            {listo ? 'Análisis listo' : 'Analizando tu plato…'}
          </h2>
        </div>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PASOS.map((texto, i) =>
            i < paso ? (
              <li key={texto} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 9999, background: '#1f2622', flex: 'none' }} />
                <span>{texto}</span>
              </li>
            ) : (
              <li key={texto} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 9999, border: '1.5px solid #5b635e', flex: 'none' }} />
                <span style={{ color: '#4d5450' }}>{texto}</span>
              </li>
            ),
          )}
        </ol>
      </section>

      <div className="pie">
        {listo ? (
          <Link to="/comida/foto/revisar" className="ft-btn ft-btn-primary boton-ancho">
            Ver resultado
          </Link>
        ) : (
          <p className="texto-pequeno" style={{ minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {error ? 'No se ha podido analizar la foto.' : 'Suele tardar unos segundos.'}
          </p>
        )}
        <Link to="/comida/foto" className="ft-btn ft-btn-secondary boton-ancho">
          Repetir foto
        </Link>
      </div>
    </div>
  )
}
