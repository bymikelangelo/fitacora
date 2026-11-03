import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Button, Icon, formatNumber } from '../design-system'
import { addEntry } from '../data/store.js'
import { analyzeFoodPhoto } from '../services/ai.js'
import { currentTime, toDateKey } from '../lib/dates.js'

/**
 * Fotografiar una comida y dejar que la IA estime sus nutrientes.
 * En móvil, el input con capture="environment" abre directamente la cámara trasera.
 */
export default function PhotoFood() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const date = params.get('dia') ?? toDateKey()

  const [photo, setPhoto] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle') // idle | analyzing | done | error

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl])

  async function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
    setStatus('analyzing')
    try {
      setResult(await analyzeFoodPhoto(file))
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  function handleSave() {
    addEntry({
      type: 'food',
      date,
      time: currentTime(),
      meal: 'Comida',
      ai: true,
      ...result,
      // La foto no se guarda todavía (pesa demasiado para localStorage).
    })
    navigate(`/?dia=${date}`)
  }

  return (
    <div className="form">
      <h1 className="page-title">Fotografiar comida</h1>

      <label className="photo-drop">
        {previewUrl ? (
          <img src={previewUrl} alt="Foto de la comida" />
        ) : (
          <span className="photo-drop-empty">
            <span className="ft-bubble">
              <Icon name="camera" />
            </span>
            Toca para hacer una foto
          </span>
        )}
        <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="visually-hidden" />
      </label>

      {status === 'analyzing' && <p className="muted" role="status">Analizando la foto…</p>}
      {status === 'error' && <p className="field-error">No se ha podido analizar la foto. Prueba otra vez.</p>}

      {status === 'done' && result && (
        <section className="ai-result" aria-label="Estimación de la IA">
          <span className="ft-ai-tag">IA</span>
          <h2 className="section-title">{result.name}</h2>
          <dl className="nutrients">
            <div><dt>Energía</dt><dd>≈ {formatNumber(result.kcal)} kcal</dd></div>
            <div><dt>Proteínas</dt><dd>≈ {formatNumber(result.protein)} g</dd></div>
            <div><dt>Hidratos</dt><dd>≈ {formatNumber(result.carbs)} g</dd></div>
            <div><dt>Grasas</dt><dd>≈ {formatNumber(result.fat)} g</dd></div>
          </dl>
          <p className="muted">Es una estimación. Podrás corregirla después.</p>
        </section>
      )}

      <div className="form-actions">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={status !== 'done' || !photo}>
          Guardar
        </Button>
      </div>
    </div>
  )
}
