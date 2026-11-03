import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages sirve la app en https://bymikelangelo.github.io/fitacora/
  base: '/fitacora/',
  server: { host: true }, // permite abrir el servidor de desarrollo desde el móvil en la misma red
})
