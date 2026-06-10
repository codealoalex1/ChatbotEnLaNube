export function opcionesUbicaciones() {
  const opciones = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Encontrar puntos cercanos (debe proporcionar su ubicacion actual)",
            callback_data: "ubicacion-actual",
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