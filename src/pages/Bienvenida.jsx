import { Link } from 'react-router'
import { Icon } from '../design-system'
import logo from '../assets/fitacora-logo.svg'
import './Bienvenida.css'

const PUNTOS = [
  { icon: 'camara', titulo: 'Fotografía tus comidas', texto: 'La IA estima sus nutrientes por ti.' },
  { icon: 'ejercicio', titulo: 'Registra tus entrenamientos', texto: 'Y descubre qué grupos musculares trabajas menos.' },
  { icon: 'calendario', titulo: 'Todo en tu calendario', texto: 'Datos y rangos de referencia, sin notas ni puntuaciones.' },
  { icon: 'balanza', titulo: 'Balance diario', texto: 'Lo que has comido y entrenado cada día, junto a su rango recomendado.' },
]

/** 1 · Bienvenida */
export default function Bienvenida() {
  return (
    <div className="pantalla bienvenida">
      <img src={logo} alt="fitácora" className="bienvenida-logo" />

      <section aria-labelledby="que-es" className="bienvenida-intro">
        <h1 id="que-es" className="titulo-seccion">Qué es Fitácora</h1>
        <p>
          Fitácora te ayuda a llevar una alimentación equilibrada y una actividad física saludable, sea cual sea tu
          objetivo personal. Lo que registres se compara con los rangos de salud que recomienda la comunidad médica.
        </p>
        <p className="texto-pequeno">Referencias: OMS (actividad física) y EFSA (nutrición), adultos.</p>
      </section>

      <ul className="bienvenida-lista">
        {PUNTOS.map((p) => (
          <li key={p.icon}>
            <span className="ft-bubble">
              <Icon name={p.icon} />
            </span>
            <span>
              <span>{p.titulo}</span>
              <span className="texto-pequeno">{p.texto}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="bienvenida-pie">
        <Link to="/cuestionario" className="ft-btn ft-btn-primary boton-ancho">
          Empezar
        </Link>
      </div>
    </div>
  )
}
