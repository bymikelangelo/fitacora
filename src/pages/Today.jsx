import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { AddEntry, Calendar, ExerciseList, FoodList } from '../design-system'
import { entriesForDate, monthRecords, useEntries } from '../data/store.js'
import { fromDateKey, longDate, toDateKey } from '../lib/dates.js'

/** Pantalla principal: el calendario del mes y lo registrado el día seleccionado. */
export default function Today() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const entries = useEntries()

  const [now] = useState(() => new Date())
  const todayKey = toDateKey(now)
  const selectedKey = params.get('dia') ?? todayKey
  const selected = fromDateKey(selectedKey)
  const year = selected.getFullYear()
  const month = selected.getMonth()
  const isThisMonth = now.getFullYear() === year && now.getMonth() === month

  const dayEntries = entriesForDate(entries, selectedKey)
  const foods = dayEntries.filter((e) => e.type === 'food')
  const exercises = dayEntries.filter((e) => e.type === 'exercise')

  const selectDate = (date) => setParams({ dia: toDateKey(date) }, { replace: true })
  const goTo = (path) => navigate(`${path}?dia=${selectedKey}`)
  const isToday = selectedKey === todayKey

  return (
    <>
      <h1 className="page-title">{longDate(selectedKey)}</h1>

      <Calendar
        year={year}
        month={month}
        records={monthRecords(entries, year, month)}
        today={isThisMonth ? now.getDate() : undefined}
        selected={selected.getDate()}
        onSelect={(d) => selectDate(new Date(year, month, d))}
        onPrev={() => selectDate(new Date(year, month - 1, 1))}
        onNext={() => selectDate(new Date(year, month + 1, 1))}
      />

      <FoodList
        items={foods}
        onAdd={() => goTo('/comida/nueva')}
        emptyText={isToday ? 'Aún no has añadido comidas hoy.' : 'No hay comidas este día.'}
      />

      <ExerciseList
        items={exercises}
        onAdd={() => goTo('/ejercicio/nuevo')}
        emptyText={isToday ? 'Aún no has añadido ejercicios hoy.' : 'No hay ejercicios este día.'}
      />

      <div className="fab">
        <AddEntry
          onSelect={(id) =>
            goTo({ photo: '/comida/foto', food: '/comida/nueva', exercise: '/ejercicio/nuevo' }[id])
          }
        />
      </div>
    </>
  )
}
