import { establecerLlenado } from "../conexiones/extranjero/formulario.conexion.js";

export function opcionesExtranjero() {
  const opciones = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Llenar formulario de pre-registro",
            callback_data: "formulario",
          },
        ],
        [
          {
            text: "Llenar formulario en la web",
            url: "https://cie.segip.gob.bo/",
          },
        ],
        [{ text: "Finalizar interaccion", callback_data: "finalizar" }],
        [{ text: "Continuar resolviendo dudas", callback_data: "continuar" }],
      ],
    },
  };
  return {
    mensaje: "¿Qué te gustaría realizar?",
    opciones: opciones,
  };
}