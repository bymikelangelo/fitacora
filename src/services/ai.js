/*
 * Servicio de IA de Fitácora — SIMULADO.
 *
 * Devuelve los mismos datos que el prototipo del lienzo para poder recorrer los
 * flujos sin servidor ni claves. Para conectar un modelo real, solo cambia este
 * archivo. Nunca pongas una clave de API en el código del navegador ni en
 * variables VITE_*: en GitHub Pages todo es público. La llamada real debe pasar
 * por una función intermedia (Cloudflare Workers, Vercel, Netlify…).
 */
import { EJERCICIOS } from '../data/catalogo.js'
import { claveFecha } from '../lib/fechas.js'

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Analiza la foto de un plato. Por ahora siempre responde «Lentejas con verduras».
 * Los ingredientes llevan sus valores por 100 g para recalcular al cambiar gramos.
 * @param {string} _foto  dataURL de la imagen
 */
export async function analizarFoto(_foto) {
  await esperar(2000)
  return {
    nombre: 'Lentejas con verduras',
    ingredientes: [
      { nombre: 'Lentejas cocidas', gramos: 250, kcal: 116, p: 9, h: 20, g: 0.4, f: 8 },
      { nombre: 'Zanahoria', gramos: 40, kcal: 41, p: 0.9, h: 10, g: 0.2, f: 2.8 },
      { nombre: 'Pimiento rojo', gramos: 30, kcal: 31, p: 1, h: 6, g: 0.3, f: 2.1 },
      { nombre: 'Aceite de oliva', gramos: 10, kcal: 884, p: 0, h: 0, g: 100, f: 0 },
    ],
  }
}

/**
 * Sugiere un ejercicio de fuerza de un grupo muscular sin registros en los
 * últimos 7 días. Devuelve null si todos los grupos se han trabajado.
 * (Por ahora es una regla simple, no un modelo.)
 * @param {Array<{ tipo: string, fecha: string, grupo?: string }>} registros
 * @param {Date} hoy
 */
export function sugerirEjercicio(registros, hoy = new Date()) {
  const desde = new Date(hoy)
  desde.setDate(desde.getDate() - 6)
  const limite = claveFecha(desde)
  const trabajados = new Set(
    registros.filter((r) => r.tipo === 'ejercicio' && r.fecha >= limite).map((r) => r.grupo),
  )
  const orden = ['remo', 'sentadillas', 'flexiones', 'press-hombros', 'plancha']
  const ejercicio = orden.map((id) => EJERCICIOS.find((e) => e.id === id)).find((e) => !trabajados.has(e.grupo))
  return ejercicio ?? null
}
