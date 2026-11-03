import { Icon } from './Icon.jsx'

/**
 * Botón Fitácora.
 * - primary: relleno `action`, la acción principal (una por pantalla).
 * - secondary: borde pino, fondo transparente.
 *
 * @param {{ variant?: 'primary' | 'secondary', size?: 'md' | 'sm', icon?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export function Button({ variant = 'primary', size, icon, className, children, ...rest }) {
  const classes = ['ft-btn', `ft-btn-${variant}`, size === 'sm' && 'ft-btn-sm', className].filter(Boolean).join(' ')
  return (
    <button type="button" {...rest} className={classes}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  )
}
