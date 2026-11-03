# Fitácora

Bitácora de alimentación y entrenamiento. Proyecto didáctico para el ESIC.

React 19 + Vite + React Router (`HashRouter`), publicada en GitHub Pages.

## Empezar

Necesitas [Node.js 22](https://nodejs.org) o superior.

```bash
git clone https://github.com/bymikelangelo/fitacora.git
cd fitacora
npm install
npm run dev
```

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en http://localhost:5173/fitacora/ |
| `npm run build` | Genera la versión publicable en `dist/` |
| `npm run preview` | Sirve `dist/` para comprobarla |
| `npm run lint` | Revisa el código (Oxlint) |

## Publicar en GitHub Pages

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** (solo la primera vez).
2. Cada `push` a `main` construye y publica la app con `.github/workflows/deploy.yml`.
