import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './design-system' // tokens y estilos de los componentes
import './index.css'
import App from './App.jsx'

// HashRouter (URLs con #/) porque GitHub Pages solo sirve archivos estáticos:
// así recargar cualquier pantalla nunca da un 404.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
