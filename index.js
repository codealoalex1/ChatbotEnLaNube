import TelegramBot from "node-telegram-bot-api";
import express from "express";
import "dotenv/config";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

import {
  determinarActualizacion,
  determinarExtranjero,
  determinarUbicaciones,
} from "./funciones/determinarProceso.funciones.js";
import { determinarOpcion } from "./opciones/opcionCentral.opciones.js";
import { opcionesExtranjero } from "./opciones/extranjero.opciones.js";
import {
  actualizarFormulario,
  guardarFormulario,
  llenarFormulario,
  obtenerDatosFormulario,
  resetearLlenado,
  verificarLlenado,
} from "./conexiones/extranjero/formulario.conexion.js";
import { consultarModelo } from "./conexiones/model.conexion.js";
import { establecerLlenado } from "./conexiones/extranjero/formulario.conexion.js";
import { opcionesUbicaciones } from "./opciones/ubicacion.opciones.js";
import { getDistance } from "./conexiones/ubicaciones/ubicaciones.conexion.js";

const app = express();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Escuchando en el puerto:", PORT);
});

const token = process.env.TOKEN_TELEGRAM_BOT;

const bot = new TelegramBot(token, {
  polling: true,
  request: {
    agentOptions: {
      keepAlive: true,
      family: 4,
    },
  },
});

bot.on("location", async (msg) => {
  const chatId = msg.chat.id;
  const lat = msg.location.latitude;
  const lon = msg.location.longitude;
  const message = await getDistance(lat, lon);
  bot.sendMessage(chatId, message, { parse_mode: "HTML" });
});

bot.onText(/\/start/, (msg) => {
  const welcomeMsg = `
<b>¡Bienvenido al Chatbot del SEGIP\\!</b>

Estoy diseñado para poder responder todas las dudas frecuentes que tengas sobre tramites a realizar en el SEGIP, como ser: <b>cedulas de identidad</b>, <b>cedulas de identidad para extranjeros</b> y <b>licencias de conducir</b>\\.`;

  return bot.sendMessage(msg.chat.id, welcomeMsg, {
    parse_mode: "HTML",
  });
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text) {
    if (!(text == "/start") && !(await verificarLlenado())) {
      const response = await consultarModelo(text);
      bot.sendMessage(chatId, response);
    }
    if (await verificarLlenado()) {
      const { field, status } = await llenarFormulario(chatId, text);
      if (!status) {
        if (text == "S" || text == "s") {
          const codigo = await guardarFormulario(chatId);
          await resetearLlenado("formulario", "actualizar", "campo");
          if (Number(codigo) == 0) {
            return bot.sendMessage(
              chatId,
              `Usted ya solicitó el pre-registro, apersonese con el número de ticket correspondiente a las oficinas para hacer su seguimiento.\n¿Tiene alguna otra consulta?`,
            );
          }
          return bot.sendMessage(
            chatId,
            `Pre-registo realizado exitosamente\nId: ${codigo}\nUna vez recepcionados sus datos, se le enviara el numero de ticket al correo electrónico proporcionado en el formulario para confirmar su pre-registro.\n¿Tiene alguna otra consulta?`,
          );
        } else if (determinarActualizacion(text)) {
          await establecerLlenado("actualizar");
          await establecerLlenado("campo", text.toLowerCase());
          return bot.sendMessage(
            chatId,
            `Escriba nuevamente su ${text.toLowerCase()}:`,
          );
        } else if (await verificarLlenado("actualizar")) {
          const message = await actualizarFormulario(chatId, text);
          return bot.sendMessage(chatId, message);
        }
        const message = await obtenerDatosFormulario(chatId);
        return bot.sendMessage(chatId, message);
      }
      return bot.sendMessage(chatId, `Ingrese su ${field}:`);
    }
    if (determinarExtranjero(text)) {
      const { mensaje, opciones } = opcionesExtranjero();
      return bot.sendMessage(chatId, mensaje, opciones);
    }
    if (determinarUbicaciones(text)) {
      const { mensaje, opciones } = opcionesUbicaciones();
      return bot.sendMessage(chatId, mensaje, opciones);
    }
  }
});

bot.on("callback_query", async (query) => await determinarOpcion(bot, query));

// Manejo de errores
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

bot.on("polling_error", (err) => console.log("Error de Polling:", err.message));
