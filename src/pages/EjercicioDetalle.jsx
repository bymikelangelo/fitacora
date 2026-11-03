import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { Icon } from '../design-system'
import { EJERCICIOS, subtituloEjercicio } from '../data/catalogo.js'
import { anadirRegistro } from '../data/store.js'
import { claveFecha, horaActual } from '../lib/fechas.js'

/** Minutos estimados de una sesión de fuerza, para el balance de actividad. */
const MINUTOS_POR_SERIE = 5

function Menos() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M5.5 12h13" />
    </svg>
  )
}

/**
 * 11 · Detalle del ejercicio — artboard EjercicioDetalle.dc.html
 * Fuerza: series, repeticiones y carga (como en el lienzo).
 * Cardio y flexibilidad: duración en minutos.
 */
export default function EjercicioDetalle() {
  const navigate = useNavigate()
  const { id } = useParams()
  const ejercicio = EJERCICIOS.find((e) => e.id === id)
  const [valores, setValores] = useState(() => ({ ...ejercicio?.valores }))
  const [hora, setHora] = useState(() => horaActual())

  if (!ejercicio) return <Navigate to="/ejercicio" replace />

  const esFuerza = ejercicio.tipo === 'fuerza'
  const paso = (clave, d, min, max) => () =>
    setValores((v) => ({ ...v, [clave]: Math.max(min, Math.min(max, (v[clave] || 0) + d)) }))

  const campos = esFuerza
    ? [
        { icon: 'series', label: 'Series', valor: String(valores.series), menos: paso('series', -1, 1, 20), mas: paso('series', 1, 1, 20), menosLabel: 'Una serie menos', masLabel: 'Una serie más' },
        { icon: 'fuerza', label: 'Repeticiones', valor: String(valores.repeticiones), menos: paso('repeticiones', -1, 1, 100), mas: paso('repeticiones', 1, 1, 100), menosLabel: 'Una repetición menos', masLabel: 'Una repetición más' },
        { icon: 'ejercicio', label: 'Carga', valor: `${valores.carga} kg`, menos: paso('carga', -1, 0, 200), mas: paso('carga', 1, 0, 200), menosLabel: 'Un kilo menos', masLabel: 'Un kilo más' },
      ]
    : [
        { icon: ejercicio.icono, label: 'Duración', valor: `${valores.duracion} min`, menos: paso('duracion', -5, 5, 300), mas: paso('duracion', 5, 5, 300), menosLabel: 'Cinco minutos menos', masLabel: 'Cinco minutos más' },
      ]

  function guardar() {
    anadirRegistro({
      tipo: 'ejercicio',
      fecha: claveFecha(),
      hora: /^\d{2}:\d{2}$/.test(hora) ? hora : horaActual(),
      ejercicioId: ejercicio.id,
      nombre: ejercicio.nombre,
      grupo: ejercicio.grupo,
      categoria: ejercicio.tipo,
      ...(esFuerza
        ? { series: valores.series, repeticiones: valores.repeticiones, carga: valores.carga, minutos: valores.series * MINUTOS_POR_SERIE }
        : { duracion: valores.duracion, minutos: valores.duracion }),
    })
    navigate('/')
  }

  return (
    <div className="pantalla pantalla-form" style={{ gap: 20 }}>
      <header className="cabecera">
        <Link to="/ejercicio" className="ft-icon-btn boton-44" aria-label="Volver a elegir ejercicio">
          <Icon name="atras" />
        </Link>
        <h1 className="titulo-seccion">{ejercicio.nombre}</h1>
      </header>

      <div className="tarjeta" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
        <Icon name={ejercicio.icono} size={56} label={`Grupo muscular: ${ejercicio.grupo.toLowerCase()}`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p style={{ margin: 0 }}>{subtituloEjercicio(ejercicio)}</p>
          <p className="texto-pequeno">{ejercicio.descripcion}</p>
        </div>
      </div>

      <section aria-labelledby="reg-titulo" className="seccion">
        <h2 id="reg-titulo" className="etiqueta-seccion">Lo que has hecho</h2>
        <div className="tarjeta" style={{ padding: '0 16px' }}>
          {campos.map((c, i) => (
            <div
              key={c.label}
              role="group"
              aria-label={c.label}
              style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 64, borderTop: i ? '1px solid var(--line)' : 0 }}
            >
              <Icon name={c.icon} />
              <span style={{ flex: 1 }}>{c.label}</span>
              <button type="button" className="ft-icon-btn boton-44" aria-label={c.menosLabel} onClick={c.menos}>
                <Menos />
              </button>
              <span className="cifras" aria-live="polite" style={{ minWidth: 64, textAlign: 'center', fontSize: 20, lineHeight: '26px' }}>
                {c.valor}
              </span>
              <button type="button" className="ft-icon-btn boton-44" aria-label={c.masLabel} onClick={c.mas}>
                <Icon name="anadir" />
              </button>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 64, borderTop: '1px solid var(--line)' }}>
            <Icon name="duracion" />
            <label htmlFor="hora" style={{ flex: 1 }}>Hora</label>
            <input
              id="hora"
              className="campo cifras"
              style={{ width: 96, height: 44, textAlign: 'center', borderRadius: 8 }}
              type="text"
              inputMode="numeric"
              value={hora}
              onChange={(e) => setHora(e.target.value.slice(0, 5))}
            />
          </div>
        </div>
      </section>

      <div className="pie">
        <button type="button" className="ft-btn ft-btn-primary boton-ancho" onClick={guardar}>
          Guardar ejercicio
        </button>
      </div>
    </div>
  )
}
