import { Route, Routes } from 'react-router'
import Bienvenida from './pages/Bienvenida.jsx'
import Cuestionario from './pages/Cuestionario.jsx'
import Inicio from './pages/Inicio.jsx'
import Dia from './pages/Dia.jsx'
import FotoCamara from './pages/FotoCamara.jsx'
import FotoAnalizando from './pages/FotoAnalizando.jsx'
import FotoResultado from './pages/FotoResultado.jsx'
import ManoBuscar from './pages/ManoBuscar.jsx'
import ManoRevisar from './pages/ManoRevisar.jsx'
import EjercicioElegir from './pages/EjercicioElegir.jsx'
import EjercicioDetalle from './pages/EjercicioDetalle.jsx'

/** Pantallas del lienzo «Fitácora · Pantallas y flujos», numeradas como allí. */
export default function App() {
  return (
    <Routes>
      <Route path="/bienvenida" element={<Bienvenida />} /> {/* 1 */}
      <Route path="/cuestionario" element={<Cuestionario />} /> {/* 2 */}
      <Route path="/" element={<Inicio />} /> {/* 3 */}
      <Route path="/dia/:fecha" element={<Dia />} /> {/* 4 */}
      <Route path="/comida/foto" element={<FotoCamara />} /> {/* 5 */}
      <Route path="/comida/foto/analizando" element={<FotoAnalizando />} /> {/* 6 */}
      <Route path="/comida/foto/revisar" element={<FotoResultado />} /> {/* 7 */}
      <Route path="/comida/buscar" element={<ManoBuscar />} /> {/* 8 */}
      <Route path="/comida/revisar" element={<ManoRevisar />} /> {/* 9 */}
      <Route path="/ejercicio" element={<EjercicioElegir />} /> {/* 10 */}
      <Route path="/ejercicio/:id" element={<EjercicioDetalle />} /> {/* 11 */}
      <Route path="*" element={<Inicio />} />
    </Routes>
  )
}
