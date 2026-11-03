import { Icon } from '../design-system'
import { balanceDelDia } from '../lib/nutricion.js'
import './BalanceDia.css'

/** Tarjeta de balance del día (Inicio y Día seleccionado). */
export default function BalanceDia({ registros }) {
  return (
    <div className="balance">
      <div>
        {balanceDelDia(registros).map((b) => (
          <div key={b.label} className="balance-fila">
            <Icon name={b.icon} />
            <span className="balance-etiqueta">{b.label}</span>
            <span className="cifras">{b.valor}</span>
            <span className="balance-rango">{b.rango}</span>
          </div>
        ))}
      </div>
      <p className="texto-pequeno balance-nota">Rango recomendado a la derecha · EFSA y OMS</p>
    </div>
  )
}
