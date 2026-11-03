/*
 * Almacén de la bitácora.
 *
 * De momento guarda los registros en el navegador (localStorage): no hace falta
 * servidor y funciona en GitHub Pages. Si más adelante se añade un backend
 * (Supabase, Firebase…), solo hay que cambiar este archivo.
 *
 * Un registro es:
 *   { id, type: 'food' | 'exercise', date: 'AAAA-MM-DD', time: 'HH:MM', name, ...datos }
 *   comida:    { meal, kcal, protein, carbs, fat, ai, photo }
 *   ejercicio: { group, sets, reps, load, duration }
 */
import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'fitacora:entries:v1'
const listeners = new Set()
let cache = load()

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

function save(entries) {
  cache = entries
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    /* almacenamiento lleno o bloqueado: seguimos en memoria */
  }
  listeners.forEach((fn) => fn())
}

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Hook: todos los registros, se actualiza solo cuando cambian. */
export function useEntries() {
  return useSyncExternalStore(subscribe, () => cache)
}

export function addEntry(entry) {
  const withId = { id: crypto.randomUUID(), ...entry }
  save([...cache, withId])
  return withId
}

export function updateEntry(id, changes) {
  save(cache.map((e) => (e.id === id ? { ...e, ...changes } : e)))
}

export function removeEntry(id) {
  save(cache.filter((e) => e.id !== id))
}

/** Registros de un día, ordenados por hora. */
export function entriesForDate(entries, dateKey) {
  return entries.filter((e) => e.date === dateKey).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
}

/** Resumen por día de un mes, en el formato que espera <Calendar records>. */
export function monthRecords(entries, year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`
  const records = {}
  for (const e of entries) {
    if (!e.date?.startsWith(prefix)) continue
    const day = Number(e.date.slice(8))
    records[day] ??= { food: 0, exercise: 0 }
    records[day][e.type] += 1
  }
  return records
}
