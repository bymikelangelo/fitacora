/** Utilidades de fecha. Las fechas se guardan como texto 'AAAA-MM-DD' (hora local). */

export function toDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function currentTime(date = new Date()) {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

/** «Martes, 3 de noviembre» */
export function longDate(key) {
  const text = fromDateKey(key).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  return text.charAt(0).toUpperCase() + text.slice(1)
}
