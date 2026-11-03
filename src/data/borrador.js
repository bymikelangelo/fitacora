/*
 * Borrador de la comida con foto mientras pasa por Cámara → Analizando → Revisar.
 * Vive solo en memoria: si se recarga la página a mitad, se vuelve a la cámara.
 */
export const borradorFoto = {
  foto: null, // dataURL de la foto
  resultado: null, // respuesta de analizarFoto
}

export function limpiarBorradorFoto() {
  borradorFoto.foto = null
  borradorFoto.resultado = null
}
