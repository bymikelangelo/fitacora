import { useState } from 'react'
import { Button } from './Button.jsx'
import { Icon } from './Icon.jsx'
import { DEFAULT_ADD_OPTIONS } from './constants.js'

/**
 * Botón principal «Añadir» que abre el menú de opciones.
 * @param {{ options?: Array<{id: string, label: string, hint?: string, icon: string, ai?: boolean}>, onSelect?: (id: string) => void, label?: string, title?: string, open?: boolean, defaultOpen?: boolean, onOpenChange?: (open: boolean) => void }} props
 */
export function AddEntry({
  options = DEFAULT_ADD_OPTIONS,
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
      <Button icon={open ? 'cerrar' : 'anadir'} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'Cerrar' : label}
      </Button>
    </div>
  )
}
