/*
 * Perfil del usuario (cuestionario inicial), guardado en el navegador.
 * { nombre, sexo: 'mujer' | 'hombre' | 'nd', edad, altura, peso }
 */
const CLAVE = 'fitacora:perfil'

export function leerPerfil() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE))
  } catch {
    return null
  }
}

export function guardarPerfil(perfil) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(perfil))
  } catch {
    /* almacenamiento bloqueado: el perfil no se conserva al recargar */
  }
}
