export async function verificarLlenado(key = "formulario") {
  const info = {
    key: key,
  };
  try {
    const response = await fetch(
      `${process.env.URL_SERVICE_MODEL}api/redis/exist-key`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(info),
      },
    );
    const { message, permisson } = await response.json();
    return permisson;
  } catch (e) {
    console.log(e.message);
    return null;
  }
}

export async function establecerLlenado(key = "formulario", value = "true") {
  const info = {
    key: key,
    value: value,
  };
  try {
    const response = await fetch(
      `${process.env.URL_SERVICE_MODEL}api/redis/set-key`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(info),
      },
    );
  } catch (e) {
    console.log(e.message);
  }
}

export async function resetearLlenado(...key) {
  const info = {
    keys: key,
  };
  try {
    const response = await fetch(
      `${process.env.URL_SERVICE_MODEL}api/redis/del-key`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify(info),
      },
    );
  } catch (e) {
    console.log(e);
  }
}

export async function llenarFormulario(chatId, value) {
  const info = {
    key: `user:${chatId}`,
    value: value,
  };
  try {
    const response = await fetch(
      `${process.env.URL_SERVICE_MODEL}api/redis/fill-form`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(info),
      },
    );
    const { field, status } = await response.json();
    return { field, status };
  } catch (e) {
    console.log(e.message);
    return { field: null, status: null };
  }
}

export async function actualizarFormulario(chatId, value) {
  const info = {
    key: `user:${chatId}`,
    value: value,
  };
  try {
    const response = await fetch(
      `${process.env.URL_SERVICE_MODEL}api/redis/update-field`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(info),
      },
    );
    const { message } = await response.json();
    return message;
  } catch (e) {
    console.log(e.message);
    return null;
  }
}

export async function obtenerDatosFormulario(chatId) {
  const info = {
    key: `user:${chatId}`,
  };
  try {
    const response = await fetch(
      `${process.env.URL_SERVICE_MODEL}api/redis/form-filled`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(info),
      },
    );
    const { message } = await response.json();
    return message;
  } catch (e) {
    console.log(e.message);
    return null;
  }
}

export async function guardarFormulario(chatId) {
  const info = {
    key: `user:${chatId}`,
  };
  try {
    const response = await fetch(
      `${process.env.URL_SERVICE_MODEL}api/redis/save-form`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(info),
      },
    );
    const { message, code } = await response.json();
    return code;
  } catch (e) {
    console.log(e.message);
    return null;
  }
}
