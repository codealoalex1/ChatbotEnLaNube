import { saveFormForeign } from "../services/db.services.js";
import { generarId } from "../function/generateId.function.js";
import {
  deleteKeyRedisService,
  fillFormService,
  formFilledService,
  formGetInfoForm,
  getKeyRedisService,
  setKeyRedisService,
  setKeySetRedisService,
} from "../services/formulario.service.js";
import { sendPreRegistryEmail } from "../function/sendEmail.js";

export async function getKeyRedisController(req, res) {
  const { key } = req.body;
  if (!key)
    return res.status(400).json({
      message: "Debe existir una llave a buscar",
      permisson: false,
    });
  try {
    if (!(await getKeyRedisService(key)))
      return res.status(200).json({
        message: "La llave a buscar no existe",
        permisson: false,
      });
    return res.status(200).json({
      message: "La llave a buscar existe",
      permisson: true,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: "Error de servidor",
      permisson: false,
    });
  }
}

export async function setKeyRedisController(req, res) {
  const { key, value } = req.body;
  if (!key || !key.trim())
    return res.status(400).json({ message: "La llave no puede estar vacia" });
  if (!value || !value.trim())
    return res.status(400).json({ message: "El valor no puede estar vacio" });
  try {
    await setKeyRedisService(key, value);
    return res.status(200).json({
      message: "Llave creada",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
}

export async function deleteKeyRedisController(req, res) {
  const { keys } = req.body;
  if (!keys)
    return res.status(400).json({ message: "La llave no puede estar vacia" });
  try {
    for (const key of keys) {
      await deleteKeyRedisService(key);
    }
    return res.status(200).json({
      message: "Llave eliminada correctamente",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
}

export async function fillFormController(req, res) {
  const { key, value } = req.body;
  if (!key || !key.trim())
    return res.status(400).json({ message: "La llave no puede estar vacia" });
  if (!value || !value.trim())
    return res.status(400).json({ message: "El valor no puede estar vacio" });
  try {
    const { field, again } = await fillFormService(key, value);
    return res.status(200).json({
      field: field,
      status: again,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
}

export async function updateFormController(req, res) {
  const { key, value } = req.body;
  const field = await getKeyRedisService("campo");
  if (!key || !key.trim())
    return res.status(400).json({ message: "La llave no puede estar vacia" });
  if (!value || !value.trim())
    return res.status(400).json({ message: "El valor no puede estar vacio" });
  try {
    await setKeySetRedisService(key, field, value);
    return res.status(200).json({
      message: `Campo actualizado con éxito\n${await formFilledService(key)}`,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
}

export async function formFilledController(req, res) {
  const { key } = req.body;
  if (!key || !key.trim())
    return res.status(400).json({
      message: "Debe escribir una llave a buscar",
    });
  try {
    const response = await formFilledService(key);
    return res.status(200).json({
      message: response,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
}

export async function saveForm(req, res) {
  const { key } = req.body;
  if (!key || !key.trim())
    return res.status(400).json({
      message: "Debe escribir una llave a buscar",
    });
  try {
    const { datos } = await formGetInfoForm(key);
    const idForeign = generarId();
    const response = await saveFormForeign([idForeign, ...datos]);
    if (response.rowCount) {
      sendPreRegistryEmail(datos[0], datos[1], datos[2], idForeign);
    }
    return res.status(200).json({
      message: "Registro realizado con éxito",
      code: idForeign
    })
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
}
