/*
 * Catálogos de alimentos y ejercicios.
 * Los nombres, raciones y kcal por ración vienen del lienzo de diseño.
 * Los valores por 100 g de pollo, arroz y ensalada también; los del resto de
 * alimentos son valores medios de referencia (BEDCA) y conviene revisarlos.
 */

export const MOMENTOS = [
  { id: 'desayuno', label: 'Desayuno' },
  { id: 'almuerzo', label: 'Almuerzo' },
  { id: 'cena', label: 'Cena' },
  { id: 'tentempie', label: 'Tentempié' },
]

export function momentoPorHora(hora = new Date().getHours()) {
  if (hora < 11) return 'desayuno'
  if (hora < 17) return 'almuerzo'
  if (hora < 20) return 'tentempie'
  return 'cena'
}

export const etiquetaMomento = (id) => MOMENTOS.find((m) => m.id === id)?.label ?? id

/** Por 100 g: kcal, p (proteínas), h (hidratos), g (grasas), f (fibra). */
export const ALIMENTOS = [
  { id: 'pollo', nombre: 'Pechuga de pollo a la plancha', racion: '120 g', gramos: 120, kcal: 165, p: 31, h: 0, g: 3.6, f: 0 },
  { id: 'arroz', nombre: 'Arroz blanco cocido', racion: '150 g', gramos: 150, kcal: 130, p: 2.7, h: 28, g: 0.3, f: 0.4 },
  { id: 'ensalada', nombre: 'Ensalada mixta', racion: '150 g', gramos: 150, kcal: 30, p: 1.3, h: 4.7, g: 0.3, f: 2 },
  { id: 'pan', nombre: 'Pan integral', racion: '2 rebanadas', gramos: 60, kcal: 250, p: 9, h: 41, g: 3.4, f: 7 },
  { id: 'huevo', nombre: 'Huevo cocido', racion: '1 unidad', gramos: 50, kcal: 155, p: 12.6, h: 1.1, g: 10.6, f: 0 },
  { id: 'yogur', nombre: 'Yogur natural', racion: '125 g', gramos: 125, kcal: 62, p: 3.5, h: 4.7, g: 3.3, f: 0 },
  { id: 'platano', nombre: 'Plátano', racion: '1 unidad', gramos: 120, kcal: 89, p: 1.1, h: 23, g: 0.3, f: 2.6 },
  { id: 'aceite', nombre: 'Aceite de oliva', racion: '1 cucharada', gramos: 10, kcal: 884, p: 0, h: 0, g: 100, f: 0 },
]

/** kcal de una ración, redondeadas (lo que muestra la lista de búsqueda). */
export const kcalRacion = (a) => Math.round((a.kcal * a.gramos) / 100)

/**
 * Ejercicios. `icono` es una silueta (m-*) o un icono de trazo.
 * Las descripciones, salvo la del remo (que viene del lienzo), son provisionales.
 * `valores` son los valores con los que empieza la pantalla de detalle.
 */
export const EJERCICIOS = [
  { id: 'sentadillas', nombre: 'Sentadillas', grupo: 'Piernas', tipo: 'fuerza', icono: 'm-piernas',
    descripcion: 'Trabaja cuádriceps y glúteos. Baja como si fueras a sentarte, con la espalda recta.',
    valores: { series: 3, repeticiones: 12, carga: 0 } },
  { id: 'remo', nombre: 'Remo con mancuerna', grupo: 'Espalda', tipo: 'fuerza', icono: 'm-espalda',
    descripcion: 'Trabaja los dorsales y la parte media de la espalda. Se hace con un brazo y luego con el otro.',
    valores: { series: 3, repeticiones: 12, carga: 10 } },
  { id: 'flexiones', nombre: 'Flexiones', grupo: 'Pecho', tipo: 'fuerza', icono: 'm-pecho',
    descripcion: 'Trabaja pecho, hombros y tríceps. Mantén el cuerpo en línea al bajar y subir.',
    valores: { series: 3, repeticiones: 10, carga: 0 } },
  { id: 'press-hombros', nombre: 'Press de hombros', grupo: 'Hombros', tipo: 'fuerza', icono: 'm-hombros',
    descripcion: 'Trabaja los deltoides. Empuja las mancuernas hacia arriba desde la altura de los hombros.',
    valores: { series: 3, repeticiones: 10, carga: 6 } },
  { id: 'plancha', nombre: 'Plancha', grupo: 'Abdomen', tipo: 'fuerza', icono: 'm-abdomen',
    descripcion: 'Trabaja el abdomen y la zona media. Aguanta apoyado en antebrazos y puntas de los pies.',
    valores: { series: 3, repeticiones: 1, carga: 0 } },
  { id: 'carrera', nombre: 'Carrera', grupo: 'Cardio', tipo: 'cardio', icono: 'cardio',
    descripcion: 'Actividad aeróbica. Empieza a un ritmo que te permita hablar.',
    valores: { duracion: 30 } },
  { id: 'bicicleta', nombre: 'Bicicleta', grupo: 'Cardio', tipo: 'cardio', icono: 'cardio',
    descripcion: 'Actividad aeróbica de bajo impacto para las articulaciones.',
    valores: { duracion: 30 } },
  { id: 'yoga', nombre: 'Yoga', grupo: 'Flexibilidad', tipo: 'flexibilidad', icono: 'flexibilidad',
    descripcion: 'Mejora la movilidad y la flexibilidad con posturas y respiración.',
    valores: { duracion: 40 } },
]

export const TIPOS_EJERCICIO = [
  { id: 'todos', label: 'Todos' },
  { id: 'fuerza', label: 'Fuerza' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'flexibilidad', label: 'Flexibilidad' },
]

/** «Espalda · Fuerza», «Cardio», «Flexibilidad» (como en el lienzo). */
export const subtituloEjercicio = (e) => (e.tipo === 'fuerza' ? `${e.grupo} · Fuerza` : e.grupo)

/** Sin tildes y en minúsculas, para buscar. */
export const normalizar = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
