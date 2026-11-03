import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { AddEntry, Calendar, Icon } from '../design-system'
import { leerPerfil } from '../data/perfil.js'
import './Inicio.css'

function saludoSegunHora(hora) {
  if (hora >= 6 && hora < 14) return 'Buenos días'
  if (hora >= 14 && hora < 21) return 'Buenas tardes'
  return 'Buenas noches'
}

/** 1234 → «1.234» */
const miles = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

/**
 * Balance de un día frente al rango recomendado (EFSA y OMS).
 * Todavía no se pueden registrar comidas ni ejercicios, así que de momento
 * se calcula sobre listas vacías.
 */
function balance({ comidas, ejercicios }) {
  const kcal = comidas.reduce((s, c) => s + c.kcal, 0)
  const prot = comidas.reduce((s, c) => s + c.p, 0)
  const min = ejercicios.reduce((s, e) => s + e.min, 0)
  return [
    { icon: 'energia', label: 'Energía', valor: `≈ ${miles(kcal)} kcal`, rango: '≈ 1.800–2.300' },
    { icon: 'proteinas', label: 'Proteínas', valor: `≈ ${prot} g`, rango: '≈ 50–70 g' },
    { icon: 'duracion', label: 'Actividad', valor: `≈ ${min} min`, rango: '≈ 30–60 min' },
  ]
}

/** 3 · Inicio */
export default function Inicio() {
  const [perfil] = useState(leerPerfil)
  const [hoy] = useState(() => new Date())
  const [mes, setMes] = useState(() => ({ y: hoy.getFullYear(), m: hoy.getMonth() }))

  // Primer acceso: sin perfil, empezamos por la bienvenida.
  if (!perfil?.nombre) return <Navigate to="/bienvenida" replace />

  const { y, m } = mes
  const esMesActual = y === hoy.getFullYear() && m === hoy.getMonth()
  const saludo = `${saludoSegunHora(hoy.getHours())}, ${perfil.nombre}`
  const registrosHoy = { comidas: [], ejercicios: [] }

  return (
    <div className="pantalla inicio">
      <header className="inicio-cabecera">
        <h1 className="titulo-seccion">{saludo}</h1>
        <Link to="/cuestionario" className="ft-icon-btn" aria-label="Perfil">
          <Icon name="perfil" />
        </Link>
      </header>

      {/* Tocar un día abre «4 · Día seleccionado», que aún no está implementada. */}
      <Calendar
        year={y}
        month={m}
        records={{}}
        today={esMesActual ? hoy.getDate() : 0}
        selected={0}
        onPrev={() => setMes({ y: m === 0 ? y - 1 : y, m: m === 0 ? 11 : m - 1 })}
        onNext={() => setMes({ y: m === 11 ? y + 1 : y, m: m === 11 ? 0 : m + 1 })}
      />

      <section aria-labelledby="hoy-titulo" className="inicio-hoy">
        <div className="inicio-hoy-cabecera">
          <h2 id="hoy-titulo" className="inicio-hoy-titulo">Hoy</h2>
          {/* Lleva a «4 · Día seleccionado» (pendiente). */}
          <button type="button" className="ft-link">
            Ver detalle
          </button>
        </div>
        <div className="inicio-balance">
          <div>
            {balance(registrosHoy).map((b) => (
              <div key={b.label} className="fila">
                <Icon name={b.icon} />
                <span className="fila-etiqueta">{b.label}</span>
                <span className="fila-valor">{b.valor}</span>
                <span className="fila-rango">{b.rango}</span>
              </div>
            ))}
          </div>
          <p className="texto-pequeno inicio-balance-nota">Rango recomendado a la derecha · EFSA y OMS</p>
        </div>
      </section>

      {/* Las opciones abren los flujos de añadir (pantallas 5–11, pendientes). */}
      <div className="inicio-anadir">
        <AddEntry />
      </div>
    </div>
  )
}
