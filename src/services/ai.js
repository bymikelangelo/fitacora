/*
 * Servicio de IA de Fitácora.
 *
 * Ahora mismo devuelve datos simulados para poder construir la interfaz sin
 * claves ni servidor. Cuando conectemos un modelo real, solo cambia este archivo:
 * las pantallas llaman a estas funciones y no saben de dónde sale la respuesta.
 *
 * ⚠️ Importante para GitHub Pages: todo lo que va en el código del navegador es
 * público. No pongas una clave de API aquí ni en un .env de Vite (VITE_*), porque
 * acabaría publicada. La llamada real debe pasar por un pequeño servidor o
 * función (Cloudflare Workers, Vercel, Netlify…) que guarde la clave.
 */

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Analiza la foto de una comida y estima sus valores nutricionales.
 * Son estimaciones: la interfaz las muestra con «≈» y permite corregirlas.
 *
 * @param {File | Blob} _photo
 * @returns {Promise<{ name: string, kcal: number, protein: number, carbs: number, fat: number }>}
 */
export async function analyzeFoodPhoto(_photo) {
  await wait(900)
  return { name: 'Plato analizado', kcal: 520, protein: 28, carbs: 55, fat: 18 }
}

/**
 * Sugiere grupos musculares que el usuario lleva tiempo sin trabajar.
 * Es una sugerencia, no un veredicto.
 *
 * @param {Array<{ type: string, date: string, group?: string }>} entries
 * @returns {Promise<string[]>}
 */
export async function suggestMuscleGroups(entries) {
  await wait(300)
  const ALL = ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core']
  const recent = new Set(entries.filter((e) => e.type === 'exercise').map((e) => e.group))
  return ALL.filter((g) => !recent.has(g)).slice(0, 2)
}
