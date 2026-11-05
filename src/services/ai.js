/*
 * Servicio de IA de Fitácora.
 *
 * Habla con el Worker de Cloudflare (carpeta worker/), que guarda la clave de
 * Claude y hace la petición. La dirección del Worker no es secreta y va en la
 * variable VITE_IA_URL (archivo .env.production). Si no está configurada, se
 * usa una respuesta simulada para poder probar la app sin Worker.
 *
 * Las estructuras de la solicitud y la respuesta están en el documento
 * «Fitácora · Estructuras JSON».
 *
 * Nunca pongas la clave de Claude en el código de la app ni en variables VITE_*:
 * en GitHub Pages todo el código es público.
 */
import { EJERCICIOS } from '../data/catalogo.js'
import { claveFecha } from '../lib/fechas.js'

const IA_URL = import.meta.env.VITE_IA_URL

/** Error con un mensaje que se puede enseñar a la persona. */
export class ErrorIA extends Error {}

const MENSAJES = {
  sin_conexion: 'No hay conexión. Revisa tu internet y prueba otra vez.',
  no_es_comida: 'No vemos comida en la foto. Prueba con otra.',
  general: 'No se ha podido analizar la foto.',
}

/**
 * Envía una foto, un texto o ambos al Worker.
 * @param {{ foto?: string|null, texto?: string|null }} solicitud  foto como data URL
 * @returns {Promise<{ tipo: 'comida'|'ejercicio'|'desconocido', comida: object|null, ejercicio: object|null }>}
 */
export async function analizar({ foto = null, texto = null }) {
  if (!IA_URL) return analisisSimulado(texto)

  let respuesta
  try {
    respuesta = await fetch(`${IA_URL.replace(/\/$/, '')}/analizar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foto, texto }),
    })
  } catch {
    throw new ErrorIA(MENSAJES.sin_conexion)
  }
  const datos = await respuesta.json().catch(() => null)
  if (!respuesta.ok || !datos?.tipo) throw new ErrorIA(MENSAJES.general)
  return datos
}

/**
 * Flujo de la foto (pantallas 5–7). Devuelve el plato en el formato que usa
 * la pantalla de revisión: { nombre, ingredientes: [{ nombre, gramos, unidad, kcal, p, h, g, f }] }
 * (nutrientes por 100 g o 100 ml).
 * @param {string} foto  data URL de la imagen (JPEG reducido a 1024 px)
 */
export async function analizarFoto(foto) {
  const resultado = await analizar({ foto, texto: null })
  if (resultado.tipo !== 'comida' || !resultado.comida) throw new ErrorIA(MENSAJES.no_es_comida)
  return {
    nombre: resultado.comida.nombre,
    ingredientes: resultado.comida.alimentos.map((a) => ({
      nombre: a.nombre,
      gramos: a.cantidad,
      unidad: a.unidad,
      kcal: a.kcal,
      p: a.proteinas,
      h: a.hidratos,
      g: a.grasas,
      f: a.fibra,
    })),
  }
}

/**
 * Flujo de «Describir con texto» (pantallas 14–16). Devuelve la respuesta del
 * Worker tal cual: { tipo, comida, ejercicio }.
 * @param {string} texto  descripción de la persona (máximo 500 caracteres)
 */
export async function analizarTexto(texto) {
  try {
    return await analizar({ foto: null, texto: texto.trim().slice(0, 500) })
  } catch (e) {
    if (e instanceof ErrorIA && e.message === MENSAJES.general) throw new ErrorIA('No se ha podido analizar la descripción.')
    throw e
  }
}

/** Respuestas fijas del prototipo, con la misma estructura que el Worker. */
async function analisisSimulado(texto) {
  await new Promise((r) => setTimeout(r, texto ? 1600 : 2000))
  if (texto && /corr|bici|camin|nad|yoga|sentadill|serie|entren/i.test(texto)) {
    return {
      tipo: 'ejercicio',
      comida: null,
      ejercicio: { nombre: 'Carrera', categoria: 'cardio', grupo: 'piernas', intensidad: 'suave', duracion_min: 30, series: null, repeticiones: null, carga_kg: null },
    }
  }
  if (texto) {
    return {
      tipo: 'comida',
      ejercicio: null,
      comida: {
        nombre: 'Bocadillo de tortilla y café con leche',
        momento: null,
        alimentos: [
          { nombre: 'Pan de barra', cantidad: 80, unidad: 'g', kcal: 265, proteinas: 9, hidratos: 49, grasas: 3.2, fibra: 2.7 },
          { nombre: 'Tortilla de patata', cantidad: 100, unidad: 'g', kcal: 196, proteinas: 6.5, hidratos: 16, grasas: 12, fibra: 1.5 },
          { nombre: 'Café con leche', cantidad: 200, unidad: 'ml', kcal: 36, proteinas: 2.4, hidratos: 3.4, grasas: 1.3, fibra: 0 },
        ],
      },
    }
  }
  return {
    tipo: 'comida',
    comida: {
      nombre: 'Lentejas con verduras',
      momento: null,
      alimentos: [
        { nombre: 'Lentejas cocidas', cantidad: 250, unidad: 'g', kcal: 116, proteinas: 9, hidratos: 20, grasas: 0.4, fibra: 8 },
        { nombre: 'Zanahoria', cantidad: 40, unidad: 'g', kcal: 41, proteinas: 0.9, hidratos: 10, grasas: 0.2, fibra: 2.8 },
        { nombre: 'Pimiento rojo', cantidad: 30, unidad: 'g', kcal: 31, proteinas: 1, hidratos: 6, grasas: 0.3, fibra: 2.1 },
        { nombre: 'Aceite de oliva', cantidad: 10, unidad: 'ml', kcal: 884, proteinas: 0, hidratos: 0, grasas: 100, fibra: 0 },
      ],
    },
    ejercicio: null,
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
