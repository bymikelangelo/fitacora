import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { AddEntry, Calendar, Icon } from '../design-system'
import BalanceDia from '../components/BalanceDia.jsx'
import { registrosDelDia, registrosDelMes, useDatos } from '../data/store.js'
import { claveFecha } from '../lib/fechas.js'
import './Inicio.css'

function saludoSegunHora(hora) {
  if (hora >= 6 && hora < 14) return 'Buenos días'
  if (hora >= 14 && hora < 21) return 'Buenas tardes'
  return 'Buenas noches'
}

const RUTAS_ANADIR = { photo: '/comida/foto', describe: '/texto', food: '/comida/buscar', exercise: '/ejercicio' }

/** 3 · Inicio. El mes que se ve va en la dirección (?mes=AAAA-MM) para volver a él desde un día. */
export default function Inicio() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { perfil, registros } = useDatos()
  const [hoy] = useState(() => new Date())

  // Primer acceso: sin perfil, empezamos por la bienvenida.
  if (!perfil?.nombre) return <Navigate to="/bienvenida" replace />

  const [py, pm] = (params.get('mes') ?? '').split('-').map(Number)
  const y = py || hoy.getFullYear()
  const m = pm ? pm - 1 : hoy.getMonth()
  const irAMes = (yy, mm) => setParams({ mes: `${yy}-${String(mm + 1).padStart(2, '0')}` }, { replace: true })

  const esMesActual = y === hoy.getFullYear() && m === hoy.getMonth()
  const hoyClave = claveFecha(hoy)

  return (
    <div className="pantalla inicio">
      <header className="cabecera inicio-cabecera">
        <h1 className="titulo-seccion">{`${saludoSegunHora(hoy.getHours())}, ${perfil.nombre}`}</h1>
        <Link to="/cuestionario" className="ft-icon-btn boton-44" aria-label="Perfil">
          <Icon name="perfil" />
        </Link>
      </header>

      <Calendar
        year={y}
        month={m}
        records={registrosDelMes(registros, y, m)}
        today={esMesActual ? hoy.getDate() : 0}
        selected={0}
        onSelect={(d) => navigate(`/dia/${claveFecha(new Date(y, m, d))}`)}
        onPrev={() => irAMes(m === 0 ? y - 1 : y, m === 0 ? 11 : m - 1)}
        onNext={() => irAMes(m === 11 ? y + 1 : y, m === 11 ? 0 : m + 1)}
      />

      <section aria-labelledby="hoy-titulo" className="inicio-hoy">
        <div className="inicio-hoy-cabecera">
          <h2 id="hoy-titulo" className="subtitulo">Hoy</h2>
          <button type="button" className="ft-link" onClick={() => navigate(`/dia/${hoyClave}`)}>
            Ver detalle
          </button>
        </div>
        <BalanceDia registros={registrosDelDia(registros, hoyClave)} />
      </section>

      <div className="inicio-anadir">
        <AddEntry onSelect={(id) => navigate(RUTAS_ANADIR[id])} />
      </div>
    </div>
  )
}
