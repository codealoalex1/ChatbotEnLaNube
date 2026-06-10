import { Router } from "express";
import { getLocationsController } from "../controller/locations.controller.js";

const app = Router();

app.post('/map', await getLocationsController);

export {app as locationRouter}