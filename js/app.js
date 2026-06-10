// ===============================
// CONFIGURACIÓN PRINCIPAL
// ===============================

// Cambia el puerto si tu backend usa otro.
// Ejemplo Railway: const API_BASE_URL = "https://tu-backend.up.railway.app/";
const API_BASE_URL = "http://chatbotbackend-production-b44d.up.railway.app/";

const FORM_FIELDS = ["nombre", "apellido", "correo"];

// ===============================
// ELEMENTOS DEL HTML
// ===============================

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const loadingMessage = document.getElementById("loadingMessage");

const btnConsulta = document.getElementById("btnConsulta");
const btnFormulario = document.getElementById("btnFormulario");
const btnUbicacion = document.getElementById("btnUbicacion");
const btnLimpiar = document.getElementById("btnLimpiar");

const locationPanel = document.getElementById("locationPanel");
const btnCerrarUbicacion = document.getElementById("btnCerrarUbicacion");
const btnUsarUbicacionActual = document.getElementById("btnUsarUbicacionActual");
const btnBuscarManual = document.getElementById("btnBuscarManual");
const inputLatitud = document.getElementById("inputLatitud");
const inputLongitud = document.getElementById("inputLongitud");

// ===============================
// ESTADO DEL CHAT
// ===============================

let conversationMode = "chat";
// chat | form | confirm | update

let selectedFieldToUpdate = null;

// ID temporal del usuario web.
// Sirve como reemplazo del chatId de Telegram.
let userKey = localStorage.getItem("segip_user_key");

if (!userKey) {
  userKey = `web:${Date.now()}:${Math.floor(Math.random() * 10000)}`;
  localStorage.setItem("segip_user_key", userKey);
}

// ===============================
// FUNCIONES GENERALES
// ===============================

function setLoading(status) {
  if (status) {
    loadingMessage.classList.remove("d-none");
  } else {
    loadingMessage.classList.add("d-none");
  }
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatBotText(text) {
  let safeText = escapeHtml(text);
 
  safeText = safeText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  safeText = safeText
    .replaceAll("&lt;b&gt;", "<strong>")
    .replaceAll("&lt;/b&gt;", "</strong>")
    .replaceAll("&lt;i&gt;", "<em>")
    .replaceAll("&lt;/i&gt;", "</em>");

  safeText = safeText.replace(
    /((https?:\/\/)?www\.[^\s<]+)/gi,
    function (url) {
      let cleanUrl = url;
      let punctuation = "";

      while (/[.,;:!?)]$/.test(cleanUrl)) {
        punctuation = cleanUrl.slice(-1) + punctuation;
        cleanUrl = cleanUrl.slice(0, -1);
      }

      const href = cleanUrl.startsWith("http")
        ? cleanUrl
        : `https://${cleanUrl}`;

      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>${punctuation}`;
    }
  );

  safeText = safeText.replace(/\n/g, "<br>");

  return safeText;
}

function addBotMessage(text) {
  const message = document.createElement("div");
  message.className = "message bot-message";

  message.innerHTML = `
    <div class="message-content">
      <strong>SEGIP Bot:</strong>
      <p>${formatBotText(text)}</p>
    </div>
  `;

  chatMessages.appendChild(message);
  scrollToBottom();
}

function addUserMessage(text) {
  const message = document.createElement("div");
  message.className = "message user-message";

  const content = document.createElement("div");
  content.className = "message-content";

  const strong = document.createElement("strong");
  strong.textContent = "Tú:";

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  content.appendChild(strong);
  content.appendChild(paragraph);
  message.appendChild(content);

  chatMessages.appendChild(message);
  scrollToBottom();
}

function resetChat() {
  chatMessages.innerHTML = "";

  addBotMessage(
    "¡Bienvenido! Puedes hacerme consultas sobre cédulas de identidad, licencias de conducir o iniciar un formulario de pre-registro."
  );

  conversationMode = "chat";
  selectedFieldToUpdate = null;
  userInput.placeholder = "Escribe tu consulta...";
}

// ===============================
// PETICIONES AL BACKEND
// ===============================

async function apiRequest(endpoint, method, body) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al conectar con el servidor");
  }

  return data;
}

async function sendMessageToModel(text) {
  const data = await apiRequest("api/model/message", "POST", {
    input: text,
  });

  return data.message;
}

async function fillForm(value) {
  return await apiRequest("api/redis/fill-form", "POST", {
    key: userKey,
    value,
  });
}

async function getFormData() {
  const data = await apiRequest("api/redis/form-filled", "POST", {
    key: userKey,
  });

  return data.message;
}

async function setRedisKey(key, value = "true") {
  return await apiRequest("api/redis/set-key", "POST", {
    key,
    value,
  });
}

async function updateFormField(value) {
  const data = await apiRequest("api/redis/update-field", "PUT", {
    key: userKey,
    value,
  });

  return data.message;
}

async function deleteRedisKeys(keys) {
  return await apiRequest("api/redis/del-key", "DELETE", {
    keys,
  });
}

async function getNearbyOffices(lat, lon) {
  const data = await apiRequest("api/location/map", "POST", {
    lat,
    lon,
  });

  return data.message;
}

// ===============================
// LÓGICA DEL CHAT
// ===============================

async function handleGeneralQuestion(text) {
  const response = await sendMessageToModel(text);
  addBotMessage(response);
}

async function startForm() {
  conversationMode = "form";
  selectedFieldToUpdate = null;
  userInput.placeholder = "Ingrese su nombre...";

  await deleteRedisKeys([userKey, "campo"]);

  addBotMessage("Llenado de formulario de pre-registro. Ingrese su nombre:");
}

async function handleFormInput(text) {
  const { field, status } = await fillForm(text);

  if (status && field) {
    userInput.placeholder = `Ingrese su ${field}...`;
    addBotMessage(`Ingrese su ${field}:`);
    return;
  }

  conversationMode = "confirm";
  userInput.placeholder = "Escriba S para confirmar o el campo a corregir...";

  const formData = await getFormData();
  addBotMessage(formData);
}

async function handleConfirmation(text) {
  const option = text.toLowerCase().trim();

  if (option === "s" || option === "si" || option === "sí") {
    await deleteRedisKeys([userKey, "campo"]);

    conversationMode = "chat";
    selectedFieldToUpdate = null;
    userInput.placeholder = "Escribe tu consulta...";

    addBotMessage(
      "Una vez recepcionados sus datos, se le enviará el número de ticket asignado al correo electrónico proporcionado en el formulario. ¿Tiene alguna otra consulta?"
    );

    return;
  }

  if (FORM_FIELDS.includes(option)) {
    selectedFieldToUpdate = option;
    conversationMode = "update";
    userInput.placeholder = `Escriba nuevamente su ${option}...`;

    addBotMessage(`Escriba nuevamente su ${option}:`);
    return;
  }

  addBotMessage(
    "Opción no válida. Escriba S para confirmar o escriba el campo que desea corregir: nombre, apellido o correo."
  );
}

async function handleUpdate(text) {
  await setRedisKey("campo", selectedFieldToUpdate);

  const response = await updateFormField(text);

  conversationMode = "confirm";
  selectedFieldToUpdate = null;
  userInput.placeholder = "Escriba S para confirmar o el campo a corregir...";

  addBotMessage(response);
}

// ===============================
// UBICACIÓN
// ===============================

function searchNearbyOffices() {
  if (!navigator.geolocation) {
    addBotMessage("Tu navegador no permite obtener la ubicación.");
    return;
  }

  addBotMessage("Solicitando acceso a tu ubicación actual...");
  setLoading(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const response = await getNearbyOffices(lat, lon);
        addBotMessage(response);
      } catch (error) {
        addBotMessage("No se pudo obtener la información de oficinas cercanas.");
      } finally {
        setLoading(false);
      }
    },
    () => {
      setLoading(false);
      addBotMessage(
        "No se pudo acceder a tu ubicación. Verifica los permisos del navegador."
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
    }
  );
}

// ===============================
// EVENTOS
// ===============================

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = userInput.value.trim();

  if (!text) return;

  addUserMessage(text);
  userInput.value = "";

  setLoading(true);

  try {
    if (conversationMode === "chat") {
      await handleGeneralQuestion(text);
    } else if (conversationMode === "form") {
      await handleFormInput(text);
    } else if (conversationMode === "confirm") {
      await handleConfirmation(text);
    } else if (conversationMode === "update") {
      await handleUpdate(text);
    }
  } catch (error) {
    addBotMessage(error.message || "Ocurrió un error inesperado.");
  } finally {
    setLoading(false);
    userInput.focus();
  }
});

btnConsulta.addEventListener("click", () => {
  conversationMode = "chat";
  selectedFieldToUpdate = null;
  userInput.placeholder = "Escribe tu consulta...";

  addBotMessage("Modo consulta general activado. ¿En qué puedo ayudarte?");
});

btnFormulario.addEventListener("click", async () => {
  setLoading(true);

  try {
    await startForm();
  } catch (error) {
    addBotMessage("No se pudo iniciar el formulario.");
  } finally {
    setLoading(false);
  }
});

btnUbicacion.addEventListener("click", () => {
  conversationMode = "chat";
  selectedFieldToUpdate = null;

  locationPanel.classList.remove("d-none");

  addBotMessage(
    "Puedes buscar oficinas cercanas usando tu ubicación actual o ingresando latitud y longitud manualmente."
  );
});

btnLimpiar.addEventListener("click", () => {
  resetChat();
});

btnCerrarUbicacion.addEventListener("click", () => {
  locationPanel.classList.add("d-none");
});

btnUsarUbicacionActual.addEventListener("click", () => {
  searchNearbyOffices();
});

btnBuscarManual.addEventListener("click", async () => {
  const lat = Number(inputLatitud.value);
  const lon = Number(inputLongitud.value);

  if (!lat || !lon) {
    addBotMessage("Debe ingresar una latitud y longitud válidas.");
    return;
  }

  setLoading(true);

  try {
    addUserMessage(`Ubicación manual: ${lat}, ${lon}`);

    const response = await getNearbyOffices(lat, lon);

    addBotMessage(response);

    locationPanel.classList.add("d-none");
  } catch (error) {
    addBotMessage("No se pudo buscar oficinas con la ubicación ingresada.");
  } finally {
    setLoading(false);
  }
});
