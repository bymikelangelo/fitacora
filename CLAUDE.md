# Fitácora — guía para asistentes de IA

App web de bitácora de alimentación y ejercicio, en español. React 19 + Vite + React Router (HashRouter), JavaScript con JSX. Se publica en GitHub Pages (`base: '/fitacora/'`). Proyecto didáctico: código claro y comentado en español por encima de abstracciones.

## Comandos
- `npm run dev` — desarrollo
- `npm run lint` — debe pasar sin avisos antes de hacer commit
- `npm run build` — debe compilar antes de hacer commit

## Reglas
- Interfaz y comentarios en español de España. Fechas y números con formato `es-ES` (1.800,5).
- Usa siempre los componentes y tokens de `src/design-system` (`import { Button } from '../design-system'`). Nada de colores, tamaños o fuentes sueltos: `var(--token)`.
- Pino (`--brand-strong`) para acciones; melocotón (`--accent`) solo para destacar, nunca en botones; mantequilla (`--ai`) solo para la IA. Un botón principal por pantalla.
- Sin juicios: ningún color ni texto valora comidas o entrenos; nada de objetivos, rachas ni barras de progreso. Textos vacíos sin reproche.
- Las cifras de la IA son estimaciones: «≈», etiqueta «IA» y opción de corregir.
- Datos solo a través de `src/data/store.js`; IA solo a través de `src/services/ai.js`.
- Nunca claves de API en el código del navegador ni en variables `VITE_*` (GitHub Pages es público).
- Una pantalla por archivo en `src/pages/`, registrada en `src/App.jsx`. Constantes compartidas en archivos `.js` aparte (Fast Refresh).
