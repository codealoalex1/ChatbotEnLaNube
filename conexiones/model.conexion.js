export async function consultarModelo(text) {
  const question = {
    input: text,
  };
  try {
    const response = await fetch(
      `${process.env.URL_SERVICE_MODEL}api/model/message`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(question),
        method: "POST",
      },
    );
    const { message } = await response.json();
    return message;
  } catch (e) {
    console.error(e.message);
      return "Hubo un error inesperado. Intente nuevamente más tarde";
  }
}
