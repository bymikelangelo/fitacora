import { normalizar } from '../data/catalogo.js'

// Palabras del prototipo (pantalla 14) para la pista «Parece un ejercicio».
// Solo orienta mientras se escribe: quien decide de verdad es la IA.
const CLAVES_EJERCICIO = [
  'corr', 'bici', 'nad', 'camin', 'sentadill', 'flexion', 'yoga', 'gimnasio', 'serie', 'entren', 'pesas',
  'remo', 'plancha', 'andar', 'paseo', 'pilates', 'futbol', 'baloncesto', 'tenis', 'padel', 'estir',
]

export const pareceEjercicio = (texto) => CLAVES_EJERCICIO.some((c) => normalizar(texto).includes(c))
