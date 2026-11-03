import { Route, Routes } from 'react-router'
import Bienvenida from './pages/Bienvenida.jsx'
import Cuestionario from './pages/Cuestionario.jsx'
import Inicio from './pages/Inicio.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/bienvenida" element={<Bienvenida />} />
      <Route path="/cuestionario" element={<Cuestionario />} />
      <Route path="*" element={<Inicio />} />
    </Routes>
  )
}
