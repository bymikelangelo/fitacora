import { useState } from 'react'
import { Button } from './Button.jsx'
import { Icon } from './Icon.jsx'
import { DEFAULT_OPTIONS } from './constants.js'

/**
 * Punto de entrada para añadir algo a la bitácora: botón principal «Añadir»
 * que abre un menú con las opciones. Es la acción principal de la pantalla.
 */
export function AddEntry({
  options = DEFAULT_OPTIONS,
  onSelect,
  label = 'Añadir',
  title = '¿Qué quieres añadir?',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}) {
  const [openState, setOpenState] = useState(defaultOpen)
  const open = openProp ?? openState

  function setOpen(value) {
    if (openProp == null) setOpenState(value)
    onOpenChange?.(value)
  }

  return (
    <div className="ft-add">
      {open && (
        <div className="ft-add-sheet" role="menu" aria-label={title}>
          <h3 className="ft-add-title">{title}</h3>
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="menuitem"
              className="ft-option"
              onClick={() => {
                onSelect?.(o.id)
                setOpen(false)
              }}
            >
              <span className="ft-bubble">
                <Icon name={o.icon} />
              </span>
              <span className="ft-option-text">
                <b>{o.label}</b>
                {o.hint && <span>{o.hint}</span>}
              </span>
              {o.ai && <span className="ft-ai-tag">IA</span>}
            </button>
          ))}
        </div>
      )}
      <Button icon={open ? 'close' : 'plus'} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'Cerrar' : label}
      </Button>
    </div>
  )
}
