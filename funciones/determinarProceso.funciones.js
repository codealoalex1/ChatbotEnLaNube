/* Determinar opciones extranjero */
const CLAVE_EXTRANJEROS = [
  "extranjero",
  "extranjera",
  "extranjeros",
  "extranjeras",
  "formulario",
  "pre-registro",
  "pre",
  "registro",
];
const CLAVE_INVALIDA = ["niño", "niña", "menor", "menores"];

export function determinarExtranjero(text) {
  let estado = false;
  const cadenaInput = text.toLowerCase().split(" ");
  for (const CLAVE of CLAVE_EXTRANJEROS) {
    if (cadenaInput.includes(CLAVE)) {
      estado = true;
    }
  }
  for (const INVALIDO of CLAVE_INVALIDA) {
    if (cadenaInput.includes(INVALIDO)) {
      estado = false;
    }
  }
  return estado;
}

/* Determinar opciones para obtener ubicaciones cercanas */

const CLAVE_UBICACIONES = ["ubicaciones", "ubicacion", "oficinas"];
export function determinarUbicaciones(text) {
  let estado = false;
  const cadenaInput = text.toLowerCase().split(" ");
  for (const CLAVE of CLAVE_UBICACIONES) {
    if (cadenaInput.includes(CLAVE)) {
      estado = true;
    }
  }
  return estado;
}


const CAMPOS = ["nombre", "apellido", "correo"];
export function determinarActualizacion(text) {
  if (CAMPOS.includes(text.toLowerCase())) {
    return true;
  }
  return false;
}