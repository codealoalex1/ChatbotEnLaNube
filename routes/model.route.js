import { Router } from "express";
import { responseModel } from "../controller/model.controller.js";

const app = Router();

app.post('/message', responseModel);

export { app as RutasModelo};