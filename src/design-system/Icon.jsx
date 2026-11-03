/*
 * Iconos propios de Fitácora: rejilla 24, trazo 1,75 en currentColor.
 * Copia de los iconos de trazo de project/components/bundle.js del sistema de diseño.
 * (Las siluetas de grupos musculares se añadirán cuando una pantalla las use.)
 */
const ICONS = {
  anadir: 'M12 5.5v13|M5.5 12h13',
  cerrar: 'M7 7l10 10|M17 7 7 17',
  atras: 'M14.5 6.5 9 12l5.5 5.5',
  adelante: 'M9.5 6.5 15 12l-5.5 5.5',
  editar: 'M15.6 5.4a2 2 0 0 1 2.9 0l.1.1a2 2 0 0 1 0 2.9L9 18l-4 1 1-4z|M13.5 7.5l3 3',
  borrar: 'M4.5 7h15|M9.5 7V5.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3V7|M6.5 7l.8 11.1a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9L17.5 7|M10.5 11v5|M13.5 11v5',
  buscar: 'c10.5,10.5,6|M15 15l4.5 4.5',
  ajustes: 'M4.5 8h8|M18 8h1.5|c15.5,8,2.25|M4.5 16h1.5|M11 16h8.5|c8.5,16,2.25',
  calendario: 'M7.5 5.5h9a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z|M4.5 10h15|M8.5 3.5v4|M15.5 3.5v4|M9 14.5h.01|M12 14.5h.01|M15 14.5h.01',
  cuaderno: 'M8.5 3.5h8a2.5 2.5 0 0 1 2.5 2.5v12a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 6 18V6a2.5 2.5 0 0 1 2.5-2.5z|M4.5 8h3|M4.5 12h3|M4.5 16h3|M10.5 8.5h5|M10.5 12h5',
  perfil: 'c12,8.5,3.5|M5.5 19.5c1-3.2 3.6-5 6.5-5s5.5 1.8 6.5 5',
  avisos: 'M7 16.5V11a5 5 0 0 1 10 0v5.5l1.5 2h-13z|M10.2 20.5a2 2 0 0 0 3.6 0',
  info: 'c12,12,8|M12 11v5|M12 8h.01',
  referencia: 'M12 6.5c-2-1.4-4.5-2-7.5-2v13c3 0 5.5.6 7.5 2 2-1.4 4.5-2 7.5-2v-13c-3 0-5.5.6-7.5 2z|M12 6.5v13',
  rango: 'M5 9.5c2.3-1.8 4.2-1.8 7 0s4.7 1.8 7 0|M5 14.5c2.3-1.8 4.2-1.8 7 0s4.7 1.8 7 0',
  balanza: 'M12 3.5v16.5|M8 20h8|M5 7h14|M5 7l-2.5 6.5|M5 7l2.5 6.5|M19 7l-2.5 6.5|M19 7l2.5 6.5|M2.5 13.5a2.5 2.5 0 0 0 5 0|M16.5 13.5a2.5 2.5 0 0 0 5 0',
  camara: 'M4 8.5a2 2 0 0 1 2-2h2l1.5-2h5l1.5 2h2a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z|c12,12.75,3.25',
  ia: 'M11 4.5c.6 3.4 2.2 5 5.5 5.5-3.3.5-4.9 2.1-5.5 5.5-.6-3.4-2.2-5-5.5-5.5 3.3-.5 4.9-2.1 5.5-5.5z|M17.5 15v4.5|M15.25 17.25h4.5',
  comida: 'M4 11.5h16c0 4.4-3.6 8-8 8s-8-3.6-8-8z|M9.5 4.5c-.9 1 .9 2 0 3|M14.5 4.5c-.9 1 .9 2 0 3',
  ejercicio: 'M8.5 12h7|M6.5 7.5h0a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h0A1.5 1.5 0 0 1 5 15V9a1.5 1.5 0 0 1 1.5-1.5z|M17.5 7.5h0A1.5 1.5 0 0 1 19 9v6a1.5 1.5 0 0 1-1.5 1.5h0A1.5 1.5 0 0 1 16 15V9a1.5 1.5 0 0 1 1.5-1.5z|M3 10.5v3|M21 10.5v3',
  desayuno: 'M5 9.5h11v5a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 14.5z|M16 11h1.25a2.25 2.25 0 0 1 0 4.5H16|M9 4.5v2|M12 4.5v2',
  almuerzo: 'M7.5 4v5a2 2 0 0 0 4 0V4|M9.5 4v16|M16.5 20V4c-1.8 1.2-2.5 3.3-2.5 6v3.5h2.5',
  cena: 'M18.5 14.2A7.2 7.2 0 1 1 9.8 5.5a5.6 5.6 0 0 0 8.7 8.7z',
  tentempie: 'M12 8.5c-1.6-1-5.4-1.1-6.4 2.4-1 3.5 1.3 8.4 4 9 1 .2 1.6-.4 2.4-.4s1.4.6 2.4.4c2.7-.6 5-5.5 4-9-1-3.5-4.8-3.4-6.4-2.4z|M12 8.5c0-2 .6-3.4 2.3-4.3',
  agua: 'M6.5 4.5h11l-1.4 13.2a2 2 0 0 1-2 1.8H9.9a2 2 0 0 1-2-1.8z|M7.3 10.5h9.4',
  energia: 'M13 3.5 6.5 13H12l-1 7.5 6.5-9.5H12z',
  proteinas: 'M12 4c3.1 0 6 4.6 6 9.2a6 6 0 0 1-12 0C6 8.6 8.9 4 12 4z',
  hidratos: 'M5.6 18.4c-1.5-1.5-.8-4.4 1.6-6.8l4.8-4.8c2.4-2.4 5.3-3.1 6.8-1.6s.8 4.4-1.6 6.8l-4.8 4.8c-2.4 2.4-5.3 3.1-6.8 1.6z|M9 12.4l1.6 2.3|M11.9 9.5l1.6 2.3|M14.8 6.6l1.4 2',
  grasas: 'M12 4c2.5 3.2 5.5 6.5 5.5 9.9a5.5 5.5 0 0 1-11 0C6.5 10.5 9.5 7.2 12 4z|M9.4 14.4a2.6 2.6 0 0 0 2.1 2.4',
  fibra: 'M5.5 18.5C5.5 10 10.5 5.5 18.5 5.5c0 8-4.5 13-13 13z|M5.5 18.5 13 11',
  fuerza: 'c12,14.5,6|M8.2 9.9V6.8a2.3 2.3 0 0 1 2.3-2.3h3a2.3 2.3 0 0 1 2.3 2.3v3.1|M10.5 7.4h3',
  cardio: 'M3.5 17V10c0-.6.4-1 1-1h2.1c.5 0 .9.3 1 .8.4 1.6 1.5 2.7 3.4 2.7h1.4l5.4 1.8c1.5.5 2.7 1.9 2.7 3.6V17|M3.5 17h17|M3.5 19.5h17|M10 9.6l1.2-1|M12.4 11.7l1.2-1.2',
  flexibilidad: 'c12,4.5,1.9|M12 8.4v5.6|M12 9.6 8.6 13.4|M12 9.6l3.4 3.8|M4.5 18c1.3-1.9 3.6-2.7 7.5-1.8 3.9-.9 6.2-.1 7.5 1.8-1.5 1.1-4.3 1.5-7.5.7-3.2.8-6 .4-7.5-.7z',
  duracion: 'c12,13,7|M12 9v4l2.5 1.5|M10 3.5h4',
  series: 'M18.6 9A7 7 0 0 0 6 8.2|M5.4 15a7 7 0 0 0 12.6.8|M18.5 4.5V9H14|M5.5 19.5V15H10',
}

/**
 * @param {{ name: string, size?: number, label?: string, className?: string }} props
 * Sin `label` el icono es decorativo (aria-hidden).
 */
export function Icon({ name, size, label, className }) {
  const style = size ? { width: size, height: size } : undefined
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }
  return (
    <svg
      className={['ft-icon', className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11y}
    >
      {(ICONS[name] || '').split('|').map((d, i) => {
        if (d.charAt(0) === 'c') {
          const [cx, cy, r] = d.slice(1).split(',')
          return <circle key={i} cx={cx} cy={cy} r={r} />
        }
        return <path key={i} d={d} />
      })}
    </svg>
  )
}
