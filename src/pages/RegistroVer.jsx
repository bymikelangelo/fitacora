import { useCallback, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Button, Icon } from '../design-system'
import ConfirmarBorrar from '../components/ConfirmarBorrar.jsx'
import { EJERCICIOS, MOMENTOS, subtituloEjercicio } from '../data/catalogo.js'
import { borrarRegistro, buscarRegistro, useDatos } from '../data/store.js'
import { deClave, fechaLarga } from '../lib/fechas.js'
import { casillasNutrientes } from '../lib/nutricion.js'

/** «martes 3 de noviembre» (para «Se quitará del …») */
const fechaEnFrase = (clave) => fechaLarga(deClave(clave)).toLowerCase().replace(',', '')

/**
 * 12 · Detalle de comida y 13 · Detalle de ejercicio — artboards ComidaVer y EjercicioVer.
 * Ruta /registro/:id
 */
export default function RegistroVer() {
  const { id } = useParams()
  const { registros } = useDatos()
  const registro = buscarRegistro(registros, id)
  const [confirmando, setConfirmando] = useState(false)
  const cancelar = useCallback(() => setConfirmando(false), [])
  const [borradoDe, setBorradoDe] = useState(null) // fecha del registro recién borrado

  // Tras borrar (o si el registro no existe) se vuelve al día o al inicio.
  if (!registro) return <Navigate to={borradoDe ? `/dia/${borradoDe}` : '/'} replace />

  const esComida = registro.tipo === 'comida'
  const volver = `/dia/${registro.fecha}`

  function borrar() {
    setBorradoDe(registro.fecha)
    borrarRegistro(registro.id)
  }

  return (
    <div className="pantalla pantalla-form">
      <header className="cabecera">
        <Link to={volver} className="ft-icon-btn boton-44" aria-label="Volver al día">
          <Icon name="atras" />
        </Link>
        <h1 className="titulo-seccion">{registro.nombre}</h1>
      </header>

      {esComida ? <DetalleComida comida={registro} /> : <DetalleEjercicio ejercicio={registro} />}

      <div className="pie" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: 8 }}>
        <Link to={rutaEditar(registro)} className="ft-btn ft-btn-primary" style={{ padding: '0 12px' }}>
          <Icon name="editar" />
          Editar
        </Link>
        <Button variant="warning" icon="borrar" onClick={() => setConfirmando(true)} style={{ width: '100%', padding: '0 12px' }}>
          Borrar
        </Button>
      </div>

      {confirmando && (
        <ConfirmarBorrar
          titulo={esComida ? '¿Borrar esta comida?' : '¿Borrar este ejercicio?'}
          texto={`Se quitará del ${fechaEnFrase(registro.fecha)}. No se puede deshacer.`}
          accion={esComida ? 'Borrar comida' : 'Borrar ejercicio'}
          onConfirmar={borrar}
          onCancelar={cancelar}
        />
      )}
    </div>
  )
}

/** Adónde lleva «Editar»: la misma pantalla con la que se creó el registro. */
function rutaEditar(r) {
  if (r.tipo === 'ejercicio') return `/ejercicio/${r.ejercicioId}?editar=${r.id}`
  return r.ia ? `/comida/foto/revisar?editar=${r.id}` : `/comida/revisar?editar=${r.id}`
}

function DetalleComida({ comida }) {
  const momentoId = MOMENTOS.find((m) => m.label === comida.momento)?.id ?? 'almuerzo'
  const aprox = comida.ia ? '≈ ' : ''
  return (
    <>
      <p className="texto-pequeno" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Icon name={momentoId} />
        <span style={{ color: 'var(--ink)' }}>
          {comida.momento} · {comida.hora}
        </span>
        {comida.ia && (
          <>
            <span className="ft-ai-tag">IA</span>Estimada por la IA
          </>
        )}
      </p>

      <section aria-labelledby="nut-titulo" className="seccion">
        <h2 id="nut-titulo" className="etiqueta-seccion">Nutrientes</h2>
        <dl className="nutrientes">
          {casillasNutrientes(comida.nutrientes ?? {}, comida.ia).map((n) => (
            <div key={n.label}>
              <dt>
                <Icon name={n.icon} size={18} />
                {n.label}
              </dt>
              <dd>{n.valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="ing-titulo" className="seccion">
        <h2 id="ing-titulo" className="etiqueta-seccion">Ingredientes</h2>
        <div className="tarjeta" style={{ padding: '0 16px' }}>
          {(comida.alimentos ?? []).map((a, i) => (
            <div
              key={`${a.nombre}-${i}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 40, borderTop: i ? '1px solid var(--line)' : 0 }}
            >
              <span>{a.nombre}</span>
              <span className="cifras" style={{ fontSize: 14, color: 'var(--ink-muted)' }}>
                {aprox}
                {a.gramos} {a.unidad ?? 'g'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function DetalleEjercicio({ ejercicio }) {
  const ficha = EJERCICIOS.find((e) => e.id === ejercicio.ejercicioId)
  const datos = ejercicio.series
    ? [
        { icon: 'series', label: 'Series', valor: String(ejercicio.series) },
        { icon: 'fuerza', label: 'Repeticiones', valor: String(ejercicio.repeticiones) },
        { icon: 'ejercicio', label: 'Carga', valor: `${ejercicio.carga ?? 0} kg` },
        { icon: 'duracion', label: 'Duración', valor: `≈ ${ejercicio.minutos} min` },
      ]
    : [{ icon: 'duracion', label: 'Duración', valor: `${ejercicio.duracion} min` }]

  return (
    <>
      <div className="tarjeta" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
        <Icon name={ficha?.icono ?? 'ejercicio'} size={56} label={`Grupo muscular: ${ejercicio.grupo.toLowerCase()}`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p style={{ margin: 0 }}>{ficha ? subtituloEjercicio(ficha) : ejercicio.grupo}</p>
          <p className="texto-pequeno">Registrado a las {ejercicio.hora}</p>
        </div>
      </div>

      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
        {datos.map((d) => (
          <div key={d.label} className="tarjeta" style={{ padding: 12 }}>
            <dt style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, lineHeight: '20px', color: 'var(--ink-muted)' }}>
              <Icon name={d.icon} size={18} />
              {d.label}
            </dt>
            <dd className="cifras" style={{ margin: '4px 0 0', fontSize: 20, lineHeight: '26px' }}>{d.valor}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}
