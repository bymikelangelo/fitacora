/* Constantes y utilidades compartidas por los componentes. */

export const DEFAULT_OPTIONS = [
  { id: 'photo', label: 'Fotografiar comida', hint: 'La IA estima los nutrientes', icon: 'camera', ai: true },
  { id: 'food', label: 'Añadir comida a mano', hint: 'Escribe lo que has comido', icon: 'utensils' },
  { id: 'exercise', label: 'Añadir ejercicio', hint: 'Series, repeticiones o minutos', icon: 'dumbbell' },
]

export const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

/** Formato español: 1.800,5 */
export function formatNumber(n) {
  const [int, dec] = String(Math.round(n * 10) / 10).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return dec ? `${grouped},${dec}` : grouped
}
