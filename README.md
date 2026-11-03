# Fitácora

Tu bitácora de alimentación y movimiento, sin juicios.

Fitácora ayuda a llevar una alimentación equilibrada y una actividad física saludable, sin objetivos de pérdida de peso ni de ganancia muscular. Reúne en un calendario todo lo que registras: comidas (a mano o con una foto que analiza la IA) y ejercicios, con sugerencias de la IA sobre grupos musculares que llevas tiempo sin trabajar.

Proyecto didáctico para la clase del ESIC **«Crea tu primera aplicación con IA en solo dos horas. Sin saber programar.»**

**App publicada:** https://bymikelangelo.github.io/fitacora/

## Tecnología

| Pieza | Elección | Por qué |
| --- | --- | --- |
| Framework | [React 19](https://react.dev) + [Vite](https://vite.dev) | Arranca en un segundo, recarga al instante al guardar y genera una web estática que GitHub Pages sirve tal cual. |
| Lenguaje | JavaScript (JSX) | Menos ceremonia que TypeScript para quien empieza; los componentes llevan comentarios JSDoc con sus props. |
| Navegación | [React Router](https://reactrouter.com) con `HashRouter` | Las URL llevan `#/` y así recargar cualquier pantalla en GitHub Pages nunca da error 404. |
| Datos | `localStorage` del navegador | Sin servidor ni cuentas: cada persona guarda su bitácora en su navegador. |
| Calidad | [Oxlint](https://oxc.rs) | Revisa el código en milisegundos. |
| Publicación | GitHub Actions → GitHub Pages | Cada `push` a `main` publica la app sola. |

## Empezar

Necesitas [Node.js 22](https://nodejs.org) o superior.

```bash
git clone https://github.com/bymikelangelo/fitacora.git
cd fitacora
npm install
npm run dev
```

Abre la dirección que aparece en la terminal (http://localhost:5173/fitacora/). Para probarla en el móvil, conéctalo a la misma wifi y abre la dirección «Network».

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga instantánea. |
| `npm run build` | Genera la versión publicable en `dist/`. |
| `npm run preview` | Sirve `dist/` para comprobar la versión publicable. |
| `npm run lint` | Revisa el código. |

## Estructura

```
src/
├── design-system/     Sistema de diseño Fitácora (no tocar sin actualizar el artefacto)
│   ├── tokens.css     Colores (claro y oscuro), tipografías, espacios y radios
│   ├── components.css Estilos de los componentes (prefijo .ft-)
│   ├── Button, AddEntry, Calendar, lists (FoodList, ExerciseList), Icon
│   └── index.js       Punto de entrada: import { Button } from '../design-system'
├── pages/             Una pantalla por archivo
│   ├── Today.jsx        Calendario + comidas y ejercicios del día
│   ├── AddFood.jsx      Añadir comida a mano
│   ├── PhotoFood.jsx    Fotografiar comida (IA)
│   └── AddExercise.jsx  Añadir ejercicio
├── data/store.js      Guardar y leer registros (localStorage)
├── services/ai.js     IA: análisis de fotos y sugerencias (de momento, simulada)
├── lib/               Utilidades (fechas, listas fijas)
├── App.jsx            Cabecera y rutas
└── main.jsx           Arranque
```

## Sistema de diseño

Los tokens y componentes vienen del artefacto **Fitácora (Design System)** en Claude. Las reglas que hay que respetar:

- **Pino** (`--brand-strong`) para todas las acciones: botones, foco, campos. Un solo botón principal por pantalla.
- **Melocotón** (`--accent`) solo para destacar (día seleccionado, fondo de iconos). Nunca en botones.
- **Mantequilla** (`--ai`) solo para la IA. Sus cifras son estimaciones: siempre con «≈» y corregibles.
- Ningún color evalúa: nada de rojo/verde para «bien» o «mal», ni barras de progreso frente a objetivos.
- Tipos: Fraunces (títulos), Hanken Grotesk (interfaz), IBM Plex Mono (cifras).

## La IA

`src/services/ai.js` devuelve de momento datos simulados para poder construir la interfaz. Para conectar un modelo real, la llamada debe pasar por un pequeño servidor o función (Cloudflare Workers, Vercel, Netlify…): **nunca pongas una clave de API en el código ni en variables `VITE_*`**, porque en GitHub Pages todo el código es público.

## Publicar en GitHub Pages

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** (solo la primera vez).
2. Sube cambios a `main`. El flujo `.github/workflows/deploy.yml` revisa, construye y publica.
