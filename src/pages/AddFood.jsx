import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '../design-system'
import { addEntry } from '../data/store.js'
import { currentTime, toDateKey } from '../lib/dates.js'
import { MEALS } from '../lib/constants.js'

/** Añadir una comida escribiéndola a mano. */
export default function AddFood() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const date = params.get('dia') ?? toDateKey()
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = form.get('name').trim()
    if (!name) {
      setError('Escribe qué has comido.')
      return
    }
    const kcal = form.get('kcal')
    addEntry({
      type: 'food',
      date,
      time: form.get('time'),
      name,
      meal: form.get('meal'),
      kcal: kcal === '' ? undefined : Number(kcal),
    })
    navigate(`/?dia=${date}`)
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1 className="page-title">Añadir comida</h1>

      <label className="field">
        <span>¿Qué has comido?</span>
        <input name="name" placeholder="Tostada con tomate y aceite" aria-invalid={!!error} autoFocus />
        {error && <span className="field-error">{error}</span>}
      </label>

      <div className="field-row">
        <label className="field">
          <span>Momento</span>
          <select name="meal" defaultValue="Comida">
            {MEALS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Hora</span>
          <input name="time" type="time" defaultValue={currentTime()} />
        </label>
      </div>

      <label className="field">
        <span>Energía (kcal, opcional)</span>
        <input name="kcal" type="number" inputMode="numeric" min="0" />
      </label>

      <div className="form-actions">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  )
}
