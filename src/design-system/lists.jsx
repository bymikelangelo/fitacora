import { Button } from './Button.jsx'
import { Icon } from './Icon.jsx'
import { formatNumber } from './constants.js'

function ListHead({ title, onAdd, addLabel = 'Añadir' }) {
  return (
    <div className="ft-list-head">
      <h2 className="ft-list-title">{title}</h2>
      {onAdd && (
        <Button variant="secondary" size="sm" icon="plus" onClick={onAdd}>
          {addLabel}
        </Button>
      )}
    </div>
  )
}

/**
 * Los ejercicios de un día. Sin totales frente a objetivos ni barras de progreso.
 * @param {{ items: Array<{ id?: string, name: string, group?: string, time?: string, sets?: number, reps?: number|string, load?: string, duration?: number }>, title?: string, onAdd?: () => void, addLabel?: string, emptyText?: string }} props
 */
export function ExerciseList({ items = [], title = 'Ejercicios', onAdd, addLabel, emptyText = 'Aún no has añadido ejercicios hoy.' }) {
  return (
    <section aria-label={title}>
      <ListHead title={title} onAdd={onAdd} addLabel={addLabel} />
      <ul className="ft-list">
        {items.length ? (
          items.map((e, i) => (
            <li key={e.id ?? i} className="ft-item">
              <span className="ft-bubble">
                <Icon name="dumbbell" />
              </span>
              <span className="ft-item-text">
                <span className="ft-item-name">{e.name}</span>
                <span className="ft-item-meta">{[e.group, e.time].filter(Boolean).join(' · ')}</span>
              </span>
              <span className="ft-item-data">
                {e.sets ? <span>{`${e.sets} × ${e.reps}`}</span> : null}
                {e.load ? <span>{e.load}</span> : e.duration ? <span>{`${e.duration} min`}</span> : null}
              </span>
            </li>
          ))
        ) : (
          <li className="ft-empty">{emptyText}</li>
        )}
      </ul>
    </section>
  )
}

/**
 * Las comidas de un día. Las cifras de la IA son estimaciones: «≈», etiqueta «IA» y «Revisar».
 * @param {{ items: Array<{ id?: string, name: string, meal?: string, time?: string, kcal?: number, ai?: boolean, photo?: string }>, title?: string, onAdd?: () => void, addLabel?: string, onReview?: (index: number) => void, emptyText?: string }} props
 */
export function FoodList({ items = [], title = 'Comidas', onAdd, addLabel, onReview, emptyText = 'Aún no has añadido comidas hoy.' }) {
  return (
    <section aria-label={title}>
      <ListHead title={title} onAdd={onAdd} addLabel={addLabel} />
      <ul className="ft-list">
        {items.length ? (
          items.map((f, i) => (
            <li key={f.id ?? i} className="ft-item">
              {f.photo ? (
                <img className="ft-thumb" src={f.photo} alt="" />
              ) : (
                <span className="ft-thumb">
                  <Icon name="utensils" />
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
                {f.ai && onReview && (
                  <button type="button" className="ft-link" onClick={() => onReview(i)}>
                    Revisar
                  </button>
                )}
              </span>
            </li>
          ))
        ) : (
          <li className="ft-empty">{emptyText}</li>
        )}
      </ul>
    </section>
  )
}
