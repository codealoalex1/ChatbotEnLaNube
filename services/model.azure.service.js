import { AzureOpenAI } from "openai";
import "dotenv/config";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = "gpt-4o-mini";
const deployment = "gpt-4o-mini";

export async function main(prompt) {
  const apiKey = process.env.AZURE_OPENAI_KEY;
  const apiVersion = "2024-04-01-preview";
  const options = { endpoint, apiKey, deployment, apiVersion };
  const systemMessage =
    "Eres el Asistente Virtual del SEGIP Bolivia. Tu función es informar sobre trámites de Cédula de Identidad y Licencias. Debes ser preciso con los requisitos y costos basados en los datos proporcionados. Si la información no está en el contexto, dirige al usuario a www.segip.gob.bo. No respondas con el texto tal cual está en los documentos, resumela y dale un formato legible, profesional y formal, no hagas uso de Markdown. La respuesta no debe superar las 150 palabras. No cites el documento del cual obtuviste la informacion. IMPORTANTE: No devuelvas información con texto en Markdown, omite asteriscos, asteriscos dobles, guiones, etc. Solo devuelve texto plano con formato legible, profesional y formal. TAMBIEN IMPORTANTE, en caso de que se te pregunte cuales son las oficinas más cercanas, pregunta donde se encuentra el usuario y si te proporciona la ciudad, brinda las centrales. Si preguntan por los horarios de oficina, analiza los archivos y determina cual es el horario de oficina más común y en este caso si no se encuentra asegura que esos son los horarios de oficina.";

  try {
    const client = new AzureOpenAI(options);
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      max_tokens: 450,
      temperature: 0.5,
      top_p: 1,
      model: modelName,
      data_sources: [
        {
          type: "azure_search",
          parameters: {
            endpoint: process.env.AZURE_SEARCH_ENDPOINT,
            index_name: process.env.AZURE_SEARCH_INDEX,
            authentication: {
              type: "api_key",
              key: process.env.AZURE_SEARCH_KEY,
            },
            top_n_documents: 2,
            strictness: 2,
          },
        },
      ],
    });

    if (response?.error !== undefined && response.status !== "200") {
      throw response.error;
    }
    return response.choices[0].message.content;
  } catch (e) {
    console.error(e);
    throw new Error("Error en la conexion con el servicio");
  }
}
