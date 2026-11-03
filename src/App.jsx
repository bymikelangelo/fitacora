import { Link, Route, Routes } from 'react-router'
import logo from './assets/logos/fitacora-logo.svg'
import logoDark from './assets/logos/fitacora-logo-sobre-oscuro.svg'
import Today from './pages/Today.jsx'
import AddFood from './pages/AddFood.jsx'
import AddExercise from './pages/AddExercise.jsx'
import PhotoFood from './pages/PhotoFood.jsx'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" aria-label="Fitácora, ir al inicio">
          <picture>
            <source srcSet={logoDark} media="(prefers-color-scheme: dark)" />
            <img src={logo} alt="fitácora" className="app-logo" />
          </picture>
        </Link>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/comida/nueva" element={<AddFood />} />
          <Route path="/comida/foto" element={<PhotoFood />} />
          <Route path="/ejercicio/nuevo" element={<AddExercise />} />
          <Route path="*" element={<Today />} />
        </Routes>
      </main>
    </div>
  )
}
