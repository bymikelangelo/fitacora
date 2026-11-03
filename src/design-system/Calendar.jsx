import { Icon } from './Icon.jsx'
import { MONTHS } from './constants.js'

const DOW = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

/**
 * El mes de la bitácora. Cada día con registros lleva un punto pino; hoy, un aro;
 * el seleccionado, el pastel melocotón. El punto no cuenta ni evalúa.
 *
 * @param {{
 *   year: number, month: number,
 *   records?: Record<number, { food?: number, exercise?: number }>,
 *   today?: number, selected?: number,
 *   onSelect?: (day: number) => void, onPrev?: () => void, onNext?: () => void,
 *   legend?: boolean,
 * }} props
 */
export function Calendar({ year, month, records = {}, today, selected, onSelect, onPrev, onNext, legend = true }) {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // lunes = 0
  const totalDays = new Date(year, month + 1, 0).getDate()

  const blanks = Array.from({ length: firstWeekday }, (_, i) => (
    <span key={`o${i}`} className="ft-day ft-day-out" aria-hidden="true" />
  ))

  const days = Array.from({ length: totalDays }, (_, i) => {
    const d = i + 1
    const r = records[d]
    const has = !!r && (r.food || 0) + (r.exercise || 0) > 0
    const parts = []
    if (r?.food) parts.push(`${r.food} ${r.food === 1 ? 'comida' : 'comidas'}`)
    if (r?.exercise) parts.push(`${r.exercise} ${r.exercise === 1 ? 'ejercicio' : 'ejercicios'}`)
    const label =
      `${d} de ${MONTHS[month]}` +
      (today === d ? ', hoy' : '') +
      (parts.length ? `, ${parts.join(' y ')}` : ', sin registros')

    return (
      <button
        key={d}
        type="button"
        className={['ft-day', today === d && 'ft-day-today'].filter(Boolean).join(' ')}
        aria-pressed={selected === d}
        aria-label={label}
        onClick={onSelect ? () => onSelect(d) : undefined}
      >
        <span className="ft-day-num">{d}</span>
        <span className={['ft-day-dot', !has && 'is-empty'].filter(Boolean).join(' ')} />
      </button>
    )
  })

  return (
    <section className="ft-cal" aria-label="Calendario">
      <div className="ft-cal-head">
        <h2 className="ft-cal-title">
          {MONTHS[month]} {year}
        </h2>
        <div className="ft-cal-nav">
          <button type="button" className="ft-icon-btn" aria-label="Mes anterior" onClick={onPrev}>
            <Icon name="left" />
          </button>
          <button type="button" className="ft-icon-btn" aria-label="Mes siguiente" onClick={onNext}>
            <Icon name="right" />
          </button>
        </div>
      </div>
      <div className="ft-cal-grid">
        {DOW.map((w) => (
          <span key={w} className="ft-dow" aria-hidden="true">
            {w}
          </span>
        ))}
        {blanks}
        {days}
      </div>
      {legend && (
        <div className="ft-cal-legend">
          <i />
          Días con registros
        </div>
      )}
    </section>
  )
}
