/* Constantes y utilidades compartidas por los componentes del sistema de diseño. */

export const DEFAULT_ADD_OPTIONS = [
  { id: 'photo', label: 'Fotografiar comida', hint: 'La IA estima los nutrientes', icon: 'camara', ai: true },
  { id: 'describe', label: 'Describir con texto', hint: 'Cuéntalo con tus palabras y la IA lo identifica', icon: 'ia', ai: true },
  { id: 'food', label: 'Añadir comida a mano', hint: 'Escribe lo que has comido', icon: 'comida' },
  { id: 'exercise', label: 'Añadir ejercicio', hint: 'Series, repeticiones o minutos', icon: 'fuerza' },
]

export const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

/** Formato español con un decimal como mucho: 1.800,5 */
export function formatNumber(n) {
  const [int, dec] = String(Math.round(n * 10) / 10).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return dec ? `${grouped},${dec}` : grouped
}
