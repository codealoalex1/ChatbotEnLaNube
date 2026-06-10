import { establecerLlenado } from "../conexiones/extranjero/formulario.conexion.js";

export async function determinarOpcion(bot, query, user) {
  const chatId = query.message.chat.id;
  const data = query.data;
  switch (data) {
    case "ubicacion-actual":
      bot.sendMessage(chatId, "Propocione su ubicación actual");
      break;
    case "formulario":
      await establecerLlenado();
      bot.sendMessage(chatId, "Llenado de formulario:\nIngrese su nombre:");
      break;
    case "finalizar":
      bot.sendMessage(
        chatId,
        "Estoy para servirte. Si tienes alguna pregunta después no dudes en consultarme",
      );
      break;
    case "continuar":
      bot.sendMessage(chatId, "¿En qué puedo ayudarte?");
      break;
    default:
      break;
  }
  bot.answerCallbackQuery(query.id);
}
