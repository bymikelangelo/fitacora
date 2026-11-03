import { useState } from 'react'
import { Link } from 'react-router'
import { Button, Icon } from '../design-system'
import { guardarPerfil, leerPerfil } from '../data/perfil.js'
import logo from '../assets/fitacora-logo.svg'
import './Cuestionario.css'

const SEXOS = [
  { id: 'mujer', label: 'Mujer' },
  { id: 'hombre', label: 'Hombre' },
  { id: 'nd', label: 'Prefiero no decirlo' },
]

/** Solo cifras, máximo 3. */
const soloCifras = (v) => String(v || '').replace(/[^0-9]/g, '').slice(0, 3)

const VACIO = { nombre: '', sexo: 'mujer', edad: '', altura: '', peso: '' }

/** 2 · Cuestionario inicial. También se abre desde el botón Perfil de Inicio. */
export default function Cuestionario() {
  const [datos, setDatos] = useState(() => ({ ...VACIO, ...leerPerfil() }))
  const [hecho, setHecho] = useState(false)
  const [errorNombre, setErrorNombre] = useState(false)

  const cambiar = (campo, valor) => setDatos((d) => ({ ...d, [campo]: valor }))

  function enviar(event) {
    event?.preventDefault()
    if (!datos.nombre.trim()) {
      setErrorNombre(true)
      return
    }
    guardarPerfil({ ...datos, nombre: datos.nombre.trim() })
    setErrorNombre(false)
    setHecho(true)
  }

  const etiquetaSexo = (SEXOS.find((s) => s.id === datos.sexo) || SEXOS[0]).label
  const resumen = [
    { label: 'Sexo', valor: etiquetaSexo },
    { label: 'Edad', valor: datos.edad ? `${datos.edad} años` : 'Sin indicar' },
    { label: 'Altura', valor: datos.altura ? `≈ ${datos.altura} cm` : 'Sin indicar' },
    { label: 'Peso', valor: datos.peso ? `≈ ${datos.peso} kg` : 'Sin indicar' },
  ]

  return (
    <div className="pantalla cuestionario">
      <div className="cuestionario-cabecera">
        <Link to="/bienvenida" className="ft-icon-btn" aria-label="Volver">
          <Icon name="atras" />
        </Link>
        <img src={logo} alt="fitácora" className="cuestionario-logo" />
        <span className="cuestionario-hueco" aria-hidden="true" />
      </div>

      {!hecho && (
        <>
          <form onSubmit={enviar} className="cuestionario-form">
            <div className="cuestionario-titulo">
              <h1 className="titulo-seccion">Cuéntanos un poco de ti</h1>
              <p className="texto-pequeno">Valen datos aproximados: solo sirven para ajustar tus rangos.</p>
            </div>

            <div className="cuestionario-campo">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                className="campo"
                type="text"
                autoComplete="given-name"
                placeholder="Cómo quieres que te llamemos"
                value={datos.nombre}
                onChange={(e) => {
                  cambiar('nombre', e.target.value)
                  setErrorNombre(false)
                }}
              />
              {errorNombre && (
                <p role="alert" className="cuestionario-error">
                  Escribe un nombre para continuar.
                </p>
              )}
            </div>

            <fieldset className="cuestionario-sexo">
              <legend>Sexo</legend>
              <div className="cuestionario-tres">
                {SEXOS.map((s) => (
                  <label key={s.id} className={datos.sexo === s.id ? 'opcion activa' : 'opcion'}>
                    <input
                      type="radio"
                      name="sexo"
                      value={s.id}
                      checked={datos.sexo === s.id}
                      onChange={() => cambiar('sexo', s.id)}
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
              <p className="texto-pequeno">Si prefieres no decirlo, usamos un rango general.</p>
            </fieldset>

            <div className="cuestionario-tres">
              <CampoNumero id="edad" label="Edad" unidad="años" placeholder="18" valor={datos.edad} hueco={44} onCambio={(v) => cambiar('edad', v)} />
              <CampoNumero id="altura" label="Altura aprox." unidad="cm" placeholder="170" valor={datos.altura} hueco={36} onCambio={(v) => cambiar('altura', v)} />
              <CampoNumero id="peso" label="Peso aprox." unidad="kg" placeholder="65" valor={datos.peso} hueco={36} onCambio={(v) => cambiar('peso', v)} />
            </div>
          </form>

          <div className="cuestionario-pie">
            <Button variant="primary" className="boton-ancho" onClick={enviar}>
              Continuar
            </Button>
          </div>
        </>
      )}

      {hecho && (
        <>
          <div className="cuestionario-hecho">
            <h1 className="titulo-seccion">Encantados, {datos.nombre.trim()}</h1>
            <p>Con estos datos ajustamos tus rangos de referencia. Puedes cambiarlos cuando quieras en Perfil.</p>
          </div>

          <dl className="cuestionario-resumen">
            {resumen.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.valor}</dd>
              </div>
            ))}
          </dl>

          <div className="cuestionario-acciones">
            <Link to="/" className="ft-btn ft-btn-primary boton-ancho">
              <Icon name="calendario" />
              Ir a mi calendario
            </Link>
            <Button variant="secondary" icon="editar" className="boton-ancho" onClick={() => setHecho(false)}>
              Editar mis datos
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function CampoNumero({ id, label, unidad, placeholder, valor, hueco, onCambio }) {
  return (
    <div className="cuestionario-campo">
      <label htmlFor={id}>{label}</label>
      <div className="campo-unidad">
        <input
          id={id}
          className="campo"
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={valor}
          onChange={(e) => onCambio(soloCifras(e.target.value))}
          style={{ paddingRight: hueco }}
        />
        <span aria-hidden="true">{unidad}</span>
      </div>
    </div>
  )
}
