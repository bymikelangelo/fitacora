/* Iconos de contorno (formas de Lucide, trazo 1,75). */
const ICONS = {
  plus: ['M12 5v14', 'M5 12h14'],
  camera: [
    'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z',
    { cx: 12, cy: 13, r: 3 },
  ],
  utensils: [
    'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2',
    'M7 2v20',
    'M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7',
  ],
  dumbbell: [
    'M14.4 14.4 9.6 9.6',
    'M18.66 21.51a2 2 0 1 1-2.83-2.83l-1.77 1.77a2 2 0 1 1-2.83-2.83l6.37-6.37a2 2 0 1 1 2.83 2.83l-1.77 1.77a2 2 0 1 1 2.83 2.83z',
    'm21.5 21.5-1.4-1.4',
    'M3.9 3.9 2.5 2.5',
    'M6.4 12.77a2 2 0 1 1-2.83-2.83l1.77-1.77a2 2 0 1 1-2.83-2.83l2.83-2.83a2 2 0 1 1 2.83 2.83l1.77-1.77a2 2 0 1 1 2.83 2.83z',
  ],
  left: ['m15 18-6-6 6-6'],
  right: ['m9 18 6-6-6-6'],
  close: ['M18 6 6 18', 'm6 6 12 12'],
}

/** @param {{ name: keyof typeof ICONS }} props */
export function Icon({ name }) {
  return (
    <svg
      className="ft-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {(ICONS[name] || []).map((shape, i) =>
        typeof shape === 'string' ? <path key={i} d={shape} /> : <circle key={i} {...shape} />,
      )}
    </svg>
  )
}
