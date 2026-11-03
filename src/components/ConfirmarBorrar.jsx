import { useEffect, useRef } from 'react'

/**
 * Hoja inferior para confirmar el borrado (pantallas 12 y 13 del lienzo).
 * Se cierra con Cancelar, tocando el fondo o con Escape.
 */
export default function ConfirmarBorrar({ titulo, texto, accion, onConfirmar, onCancelar }) {
  const cancelarRef = useRef(null)

  useEffect(() => {
    cancelarRef.current?.focus()
    const alPulsar = (e) => e.key === 'Escape' && onCancelar()
    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [onCancelar])

  return (
    <>
      <div onClick={onCancelar} aria-hidden="true" style={{ position: 'fixed', inset: 0, background: 'rgba(31, 38, 34, 0.32)' }} />
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="conf-titulo"
        aria-describedby="conf-texto"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          maxWidth: 390,
          margin: '0 auto',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: 'var(--surface-raised)',
          borderRadius: '14px 14px 0 0',
          boxShadow: '0 -12px 28px -6px rgba(0, 0, 0, 0.18)',
        }}
      >
        <h2 id="conf-titulo" className="subtitulo">{titulo}</h2>
        <p id="conf-texto" style={{ margin: 0, color: 'var(--ink-muted)' }}>{texto}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <button type="button" className="ft-btn ft-btn-warning" onClick={onConfirmar}>
            {accion}
          </button>
          <button ref={cancelarRef} type="button" className="ft-btn ft-btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </section>
    </>
  )
}
