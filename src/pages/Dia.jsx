import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { ExerciseList, FoodList, Icon } from '../design-system'
import BalanceDia from '../components/BalanceDia.jsx'
import { registrosDelDia, useDatos } from '../data/store.js'
import { claveFecha, deClave, fechaLarga } from '../lib/fechas.js'

/** 4 · Día seleccionado — artboard Dia.dc.html */
export default function Dia() {
  const { fecha } = useParams()
  const navigate = useNavigate()
  const { registros } = useDatos()
  const [hoyClave] = useState(() => claveFecha())

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha ?? '')) return <Navigate to="/" replace />

  const dia = registrosDelDia(registros, fecha)
  const comidas = dia.filter((r) => r.tipo === 'comida')
  const ejercicios = dia.filter((r) => r.tipo === 'ejercicio')
  const esHoy = fecha === hoyClave
  const futuro = fecha > hoyClave

  return (
    <div className="pantalla pantalla-form" style={{ gap: 20, paddingBottom: 16 }}>
      <header className="cabecera">
        <Link to={`/?mes=${fecha.slice(0, 7)}`} className="ft-icon-btn boton-44" aria-label="Volver al calendario">
          <Icon name="atras" />
        </Link>
        <h1 className="titulo-seccion">{esHoy ? 'Hoy' : fechaLarga(deClave(fecha))}</h1>
      </header>

      {dia.length > 0 && (
        <section aria-labelledby="bal-titulo" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 id="bal-titulo" className="subtitulo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="balanza" />
            Balance del día
          </h2>
          <BalanceDia registros={dia} />
        </section>
      )}

      <FoodList
        title="Comidas"
        onOpen={(i) => navigate(`/registro/${comidas[i].id}`)}
        items={comidas.map((c) => ({
          name: c.nombre,
          meal: c.momento,
          time: c.hora,
          kcal: c.nutrientes ? Math.round(c.nutrientes.kcal) : undefined,
          ai: !!c.ia,
          photo: c.foto,
        }))}
        emptyText={
          esHoy ? 'Aún no has añadido comidas hoy.' : futuro ? 'Este día todavía no ha llegado.' : 'No hay comidas registradas este día.'
        }
      />

      <ExerciseList
        title="Entrenamiento"
        onOpen={(i) => navigate(`/registro/${ejercicios[i].id}`)}
        items={ejercicios.map((e) =>
          e.series
            ? { name: e.nombre, group: e.grupo, time: e.hora, sets: e.series, reps: e.repeticiones, load: e.carga ? `${e.carga} kg` : undefined }
            : { name: e.nombre, group: e.grupo, time: e.hora, duration: e.duracion },
        )}
        emptyText={
          esHoy ? 'Aún no has añadido ejercicios hoy.' : futuro ? 'Este día todavía no ha llegado.' : 'No hay ejercicios registrados este día.'
        }
      />
    </div>
  )
}
