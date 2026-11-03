/*
 * Almacén de Fitácora: perfil del usuario y registros (comidas y ejercicios).
 *
 * Se guarda en el navegador (localStorage) y se puede exportar e importar como
 * un archivo JSON con este formato:
 *
 *   {
 *     "app": "fitacora",
 *     "version": 1,
 *     "exportado": "2026-11-03T18:00:00.000Z",
 *     "perfil": { nombre, sexo, edad, altura, peso } | null,
 *     "registros": [ ...comidas y ejercicios ]
 *   }
 *
 * Comida:    { id, tipo: 'comida', fecha: 'AAAA-MM-DD', hora: 'HH:MM', momento, nombre,
 *              ia, foto?, alimentos: [{ id?, nombre, gramos, kcal, p, h, g, f }]  (valores por 100 g),
 *              nutrientes: { kcal, proteinas, hidratos, grasas, fibra } }
 * Ejercicio: { id, tipo: 'ejercicio', fecha, hora, ejercicioId, nombre, grupo, categoria,
 *              series?, repeticiones?, carga?, duracion?, minutos }
 */
import { useSyncExternalStore } from 'react'

const CLAVE = 'fitacora:datos'
const CLAVE_ANTIGUA_PERFIL = 'fitacora:perfil'
export const VERSION = 1

const oyentes = new Set()
let estado = cargar()

function cargar() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE))
    if (guardado?.version === VERSION) return { perfil: guardado.perfil ?? null, registros: guardado.registros ?? [] }
    // Versión anterior: solo se guardaba el perfil.
    const perfil = JSON.parse(localStorage.getItem(CLAVE_ANTIGUA_PERFIL))
    return { perfil: perfil ?? null, registros: [] }
  } catch {
    return { perfil: null, registros: [] }
  }
}

function guardar(nuevo) {
  estado = nuevo
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ version: VERSION, ...estado }))
    localStorage.removeItem(CLAVE_ANTIGUA_PERFIL)
  } catch {
    /* almacenamiento lleno o bloqueado: los datos siguen en memoria hasta recargar */
  }
  oyentes.forEach((fn) => fn())
}

function suscribir(fn) {
  oyentes.add(fn)
  return () => oyentes.delete(fn)
}

/** Hook: { perfil, registros }. La pantalla se actualiza sola cuando cambian. */
export function useDatos() {
  return useSyncExternalStore(suscribir, () => estado)
}

export function leerPerfil() {
  return estado.perfil
}

export function guardarPerfil(perfil) {
  guardar({ ...estado, perfil })
}

export function anadirRegistro(registro) {
  guardar({ ...estado, registros: [...estado.registros, { id: crypto.randomUUID(), ...registro }] })
}

export function actualizarRegistro(id, cambios) {
  guardar({ ...estado, registros: estado.registros.map((r) => (r.id === id ? { ...r, ...cambios, id } : r)) })
}

export function borrarRegistro(id) {
  guardar({ ...estado, registros: estado.registros.filter((r) => r.id !== id) })
}

export function buscarRegistro(registros, id) {
  return registros.find((r) => r.id === id) ?? null
}

/** Registros de un día ('AAAA-MM-DD'), por hora. */
export function registrosDelDia(registros, fecha) {
  return registros.filter((r) => r.fecha === fecha).sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
}

/** Resumen por día de un mes, en el formato de <Calendar records>. */
export function registrosDelMes(registros, year, month) {
  const prefijo = `${year}-${String(month + 1).padStart(2, '0')}-`
  const resumen = {}
  for (const r of registros) {
    if (!r.fecha?.startsWith(prefijo)) continue
    const dia = Number(r.fecha.slice(8))
    resumen[dia] ??= { food: 0, exercise: 0 }
    resumen[dia][r.tipo === 'comida' ? 'food' : 'exercise'] += 1
  }
  return resumen
}

/* ───────── Exportar e importar ───────── */

/** Todos los datos como texto JSON. */
export function exportarJSON() {
  return JSON.stringify(
    { app: 'fitacora', version: VERSION, exportado: new Date().toISOString(), ...estado },
    null,
    2,
  )
}

/** Descarga un archivo fitacora-AAAA-MM-DD.json con todos los datos. */
export function descargarCopia() {
  const blob = new Blob([exportarJSON()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fitacora-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Sustituye todos los datos por los de un JSON exportado.
 * Lanza un Error con un mensaje legible si el archivo no es válido.
 * @param {string} texto
 */
export function importarJSON(texto) {
  let datos
  try {
    datos = JSON.parse(texto)
  } catch {
    throw new Error('El archivo no es un JSON válido.')
  }
  if (datos?.app !== 'fitacora') throw new Error('El archivo no es una copia de Fitácora.')
  if (datos.version !== VERSION) throw new Error(`Versión de copia no compatible (${datos.version}).`)
  if (!Array.isArray(datos.registros)) throw new Error('La copia no tiene registros.')
  const validos = datos.registros.every(
    (r) => r && (r.tipo === 'comida' || r.tipo === 'ejercicio') && /^\d{4}-\d{2}-\d{2}$/.test(r.fecha) && r.nombre,
  )
  if (!validos) throw new Error('Algún registro de la copia está incompleto.')
  guardar({
    perfil: datos.perfil ?? null,
    registros: datos.registros.map((r) => ({ ...r, id: r.id || crypto.randomUUID() })),
  })
}

/** Lee un archivo elegido con <input type="file"> e importa su contenido. */
export async function importarArchivo(archivo) {
  importarJSON(await archivo.text())
}
