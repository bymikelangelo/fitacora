/** Reduce una imagen o un fotograma de vídeo a JPEG con el lado mayor ≤ maxLado. */
export function reducirImagen(fuente, ancho, alto, maxLado = 1024, calidad = 0.82) {
  const escala = Math.min(1, maxLado / Math.max(ancho, alto))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(ancho * escala)
  canvas.height = Math.round(alto * escala)
  canvas.getContext('2d').drawImage(fuente, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', calidad)
}

/** Carga un dataURL o URL en un <img>. */
export function cargarImagen(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Archivo de imagen → dataURL reducido. */
export async function archivoADataURL(archivo, maxLado = 1024) {
  const url = URL.createObjectURL(archivo)
  try {
    const img = await cargarImagen(url)
    return reducirImagen(img, img.naturalWidth, img.naturalHeight, maxLado)
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Miniatura cuadrada (recorte central) para guardar con la comida. */
export async function miniatura(dataURL, lado = 128) {
  const img = await cargarImagen(dataURL)
  const corte = Math.min(img.naturalWidth, img.naturalHeight)
  const canvas = document.createElement('canvas')
  canvas.width = lado
  canvas.height = lado
  canvas
    .getContext('2d')
    .drawImage(img, (img.naturalWidth - corte) / 2, (img.naturalHeight - corte) / 2, corte, corte, 0, 0, lado, lado)
  return canvas.toDataURL('image/jpeg', 0.75)
}
