import { Button } from './Button.jsx'
import { Icon } from './Icon.jsx'
import { formatNumber } from './constants.js'

function ListHead({ title, onAdd, addLabel }) {
  return (
    <div className="ft-list-head">
      <h2 className="ft-list-title">{title}</h2>
      {onAdd !== undefined && (
        <Button variant="secondary" size="sm" icon="anadir" onClick={onAdd || undefined}>
          {addLabel || 'Añadir'}
        </Button>
      )}
    </div>
  )
}

/**
 * Fila de lista. Con `onOpen`, toda la fila es un botón que abre el registro
 * (añadido en la app: el lienzo tiene las pantallas de detalle, pero no cómo se llega).
 */
function Fila({ onOpen, children }) {
  if (!onOpen) return <li className="ft-item">{children}</li>
  return (
    <li className="ft-item ft-item-abrible">
      <button type="button" className="ft-item-boton" onClick={onOpen}>
        {children}
        <Icon name="adelante" />
      </button>
    </li>
  )
}

/**
 * Los ejercicios de un día.
 * @param {{ items: Array<{ name: string, group?: string, time?: string, sets?: number, reps?: number|string, load?: string, duration?: number }>, title?: string, onAdd?: () => void, addLabel?: string, emptyText?: string }} props
 */
export function ExerciseList({ items = [], title = 'Ejercicios', onAdd, addLabel, emptyText, onOpen }) {
  return (
    <section aria-label={title}>
      <ListHead title={title} onAdd={onAdd} addLabel={addLabel} />
      <ul className="ft-list">
        {items.length ? (
          items.map((e, i) => (
            <Fila key={i} onOpen={onOpen && (() => onOpen(i))}>
              <span className="ft-bubble">
                <Icon name="fuerza" />
              </span>
              <span className="ft-item-text">
                <span className="ft-item-name">{e.name}</span>
                <span className="ft-item-meta">{[e.group, e.time].filter(Boolean).join(' · ')}</span>
              </span>
              <span className="ft-item-data">
                {e.sets ? <span>{`${e.sets} × ${e.reps}`}</span> : null}
                {e.load || e.duration ? <span>{e.load || `${e.duration} min`}</span> : null}
              </span>
            </Fila>
          ))
        ) : (
          <li className="ft-empty">{emptyText || 'Aún no has añadido ejercicios hoy.'}</li>
        )}
      </ul>
    </section>
  )
}

/**
 * Las comidas de un día. Las de la IA llevan «≈» y la etiqueta «IA».
 * @param {{ items: Array<{ name: string, meal?: string, time?: string, kcal?: number, ai?: boolean, photo?: string }>, title?: string, onAdd?: () => void, addLabel?: string, onReview?: (index: number) => void, emptyText?: string }} props
 */
export function FoodList({ items = [], title = 'Comidas', onAdd, addLabel, onReview, emptyText, onOpen }) {
  return (
    <section aria-label={title}>
      <ListHead title={title} onAdd={onAdd} addLabel={addLabel} />
      <ul className="ft-list">
        {items.length ? (
          items.map((f, i) => (
            <Fila key={i} onOpen={onOpen && (() => onOpen(i))}>
              {f.photo ? (
                <img className="ft-thumb" src={f.photo} alt="" />
              ) : (
                <span className="ft-thumb">
                  <Icon name="comida" />
                </span>
              )}
              <span className="ft-item-text">
                <span className="ft-item-name">{f.name}</span>
                <span className="ft-item-meta">
                  {[f.meal, f.time].filter(Boolean).join(' · ')}
                  {f.ai && <span className="ft-ai-tag">IA</span>}
                </span>
              </span>
              <span className="ft-item-data">
                {f.kcal != null && <span>{`${f.ai ? '≈ ' : ''}${formatNumber(f.kcal)} kcal`}</span>}
              </span>
              {f.ai && onReview ? (
                <button type="button" className="ft-edit" aria-label={`Revisar ${f.name}`} title="Revisar" onClick={() => onReview(i)}>
                  <Icon name="editar" />
                </button>
              ) : onReview ? (
                <span className="ft-edit" aria-hidden="true" />
              ) : null}
            </Fila>
          ))
        ) : (
          <li className="ft-empty">{emptyText || 'Aún no has añadido comidas hoy.'}</li>
        )}
      </ul>
    </section>
  )
}
