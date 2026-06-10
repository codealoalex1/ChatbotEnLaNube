import { Router } from "express";
import { deleteKeyRedisController, fillFormController, formFilledController, getKeyRedisController, setKeyRedisController, updateFormController } from "../controller/formulario.controller.js";

const app = Router();

app.post("/exist-key", await getKeyRedisController);
app.post("/set-key", await setKeyRedisController);
app.post("/fill-form", await fillFormController);
app.post("/form-filled", await formFilledController);
app.put("/update-field", await updateFormController);
app.delete("/del-key", await deleteKeyRedisController);

export {app as redisOptions}