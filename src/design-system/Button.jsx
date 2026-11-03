import { Icon } from './Icon.jsx'

/**
 * Botón Fitácora, siempre en pino.
 * - primary: relleno pino, etiqueta grande. Solo uno por pantalla.
 * - secondary: borde pino, fondo transparente. Para el resto de acciones.
 * Nunca en melocotón.
 *
 * @param {{ variant?: 'primary' | 'secondary', size?: 'md' | 'sm', icon?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export function Button({ variant = 'primary', size = 'md', icon, className, children, ...rest }) {
  const classes = ['ft-btn', `ft-btn-${variant}`, size === 'sm' && 'ft-btn-sm', className]
    .filter(Boolean)
    .join(' ')
  return (
    <button type="button" {...rest} className={classes}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  )
}
