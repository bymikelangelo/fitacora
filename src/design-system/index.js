/*
 * Sistema de diseño Fitácora — punto de entrada único.
 * Importa siempre desde aquí:  import { Button, Calendar } from '../design-system'
 */
import './tokens.css'
import './components.css'

export { Icon } from './Icon.jsx'
export { Button } from './Button.jsx'
export { AddEntry } from './AddEntry.jsx'
export { Calendar } from './Calendar.jsx'
export { FoodList, ExerciseList } from './lists.jsx'
export { DEFAULT_OPTIONS, MONTHS, formatNumber } from './constants.js'
