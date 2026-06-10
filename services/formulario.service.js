import { createClient } from "redis";
import "dotenv/config";

const clientOptions = {
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
};

const client = createClient(clientOptions);
client.on("error", (err) => console.log(err.message));
await client.connect();

export async function getKeyRedisService(key) {
  return await client.GET(key);
}

export async function setKeyRedisService(key, value) {
  await client.SET(key, value);
  await client.expire(key, 300);
}

export async function deleteKeyRedisService(key) {
  await client.DEL(key);
}

export async function getKeySetRedisService(key, field) {
  return await client.HGET(key, field);
}

export async function setKeySetRedisService(key, field, value) {
  await client.HSET(key, field, value);
  await client.expire(key, 60);
}

const FIELDS = ["nombre", "apellido", "correo"];

export async function fillFormService(key, value) {
  for (let i = 0; i < FIELDS.length; i++) {
    if (!(await getKeySetRedisService(key, FIELDS[i]))) {
      await setKeySetRedisService(key, FIELDS[i], value);
      if (i == FIELDS.length - 1) {
        return {
          field: null,
          again: false,
        };
      }
      return {
        field: FIELDS[i + 1],
        again: true,
      };
    }
  }
}

export async function formFilledService(key) {
  let message = "Sus datos son:\n";
  for (let i = 0; i < FIELDS.length; i++) {
    message += `${FIELDS[i]}: ${await getKeySetRedisService(key, FIELDS[i])}\n`;
  }
  return (message +=
    "Si todos los datos son correctos, escriba S, si quiere cambiar algún campo, escriba el nombre del campo (Ej. nombre)");
}

export async function formGetInfoForm(key) {
  let datos = [];
  for (let i = 0; i < FIELDS.length; i++) {
    datos.push(await getKeySetRedisService(key, FIELDS[i]));
  }
  return {datos};
}
