import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '../design-system'
import { addEntry } from '../data/store.js'
import { currentTime, toDateKey } from '../lib/dates.js'
import { MUSCLE_GROUPS } from '../lib/constants.js'

const numberOrUndefined = (v) => (v === '' || v == null ? undefined : Number(v))

/** Añadir un ejercicio: series y repeticiones, o minutos. */
export default function AddExercise() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const date = params.get('dia') ?? toDateKey()
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = form.get('name').trim()
    if (!name) {
      setError('Escribe el nombre del ejercicio.')
      return
    }
    addEntry({
      type: 'exercise',
      date,
      time: form.get('time'),
      name,
      group: form.get('group'),
      sets: numberOrUndefined(form.get('sets')),
      reps: numberOrUndefined(form.get('reps')),
      load: form.get('load').trim() || undefined,
      duration: numberOrUndefined(form.get('duration')),
    })
    navigate(`/?dia=${date}`)
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1 className="page-title">Añadir ejercicio</h1>

      <label className="field">
        <span>Ejercicio</span>
        <input name="name" placeholder="Sentadilla" aria-invalid={!!error} autoFocus />
        {error && <span className="field-error">{error}</span>}
      </label>

      <div className="field-row">
        <label className="field">
          <span>Grupo muscular</span>
          <select name="group" defaultValue="Piernas">
            {MUSCLE_GROUPS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Hora</span>
          <input name="time" type="time" defaultValue={currentTime()} />
        </label>
      </div>

      <div className="field-row">
        <label className="field">
          <span>Series</span>
          <input name="sets" type="number" inputMode="numeric" min="0" />
        </label>
        <label className="field">
          <span>Repeticiones</span>
          <input name="reps" type="number" inputMode="numeric" min="0" />
        </label>
      </div>

      <div className="field-row">
        <label className="field">
          <span>Carga</span>
          <input name="load" placeholder="40 kg" />
        </label>
        <label className="field">
          <span>o minutos</span>
          <input name="duration" type="number" inputMode="numeric" min="0" />
        </label>
      </div>

      <div className="form-actions">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  )
}
