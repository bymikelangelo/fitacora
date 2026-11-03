import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Icon } from '../design-system'
import { borradorFoto, limpiarBorradorFoto } from '../data/borrador.js'
import { archivoADataURL, reducirImagen } from '../lib/imagen.js'
import './FotoCamara.css'

/**
 * 5 · Cámara — artboard FotoCamara.dc.html
 * Muestra la cámara trasera en el visor. Si el navegador no da acceso a la
 * cámara, el disparador abre la cámara del sistema (o la galería).
 */
export default function FotoCamara() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const galeriaRef = useRef(null)
  const sistemaRef = useRef(null)
  const [camaraLista, setCamaraLista] = useState(false)
  const [sinCamara, setSinCamara] = useState(() => !navigator.mediaDevices?.getUserMedia)

  useEffect(() => {
    limpiarBorradorFoto()
    let stream
    let cancelado = false
    if (!navigator.mediaDevices?.getUserMedia) return
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((s) => {
        if (cancelado) return s.getTracks().forEach((t) => t.stop())
        stream = s
        videoRef.current.srcObject = s
        setCamaraLista(true)
      })
      .catch(() => setSinCamara(true))
    return () => {
      cancelado = true
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function continuar(dataURL) {
    borradorFoto.foto = dataURL
    navigate('/comida/foto/analizando')
  }

  function disparar() {
    const v = videoRef.current
    if (camaraLista && v.videoWidth) continuar(reducirImagen(v, v.videoWidth, v.videoHeight))
    else sistemaRef.current.click()
  }

  async function elegirArchivo(event) {
    const archivo = event.target.files?.[0]
    if (archivo) continuar(await archivoADataURL(archivo))
  }

  return (
    <div className="pantalla camara">
      <div className="camara-visor" role="img" aria-label="Vista de la cámara: aquí se ve el plato">
        <video ref={videoRef} autoPlay playsInline muted hidden={!camaraLista} />
        {sinCamara && <span className="camara-aviso">No hay acceso a la cámara. Usa el botón para hacer o elegir una foto.</span>}
        <div className="camara-marco" aria-hidden="true">
          <span className="esq-1" />
          <span className="esq-2" />
          <span className="esq-3" />
          <span className="esq-4" />
        </div>
      </div>

      <div className="camara-arriba">
        <Link to="/" className="ft-icon-btn oscuro camara-velo boton-44" aria-label="Cerrar cámara">
          <Icon name="cerrar" />
        </Link>
        <span className="camara-pista camara-velo">
          <span className="ft-ai-tag">IA</span>Encuadra el plato desde arriba
        </span>
        <span style={{ width: 44 }} aria-hidden="true" />
      </div>

      <div className="camara-abajo">
        <p>La IA estimará los alimentos y sus nutrientes. Podrás revisarlo todo antes de guardar.</p>
        <div className="camara-controles">
          <button
            type="button"
            className="ft-icon-btn oscuro camara-galeria"
            aria-label="Elegir una foto de la galería"
            onClick={() => galeriaRef.current.click()}
          >
            <Icon name="cuaderno" />
          </button>
          <button type="button" className="disparador" aria-label="Hacer la foto" onClick={disparar}>
            <Icon name="camara" size={28} />
          </button>
          <span style={{ width: 52 }} aria-hidden="true" />
        </div>
      </div>

      <input ref={galeriaRef} type="file" accept="image/*" hidden onChange={elegirArchivo} />
      <input ref={sistemaRef} type="file" accept="image/*" capture="environment" hidden onChange={elegirArchivo} />
    </div>
  )
}
