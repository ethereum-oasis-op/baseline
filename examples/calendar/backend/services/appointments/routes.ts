import express from "express";
import { config } from "../../config";
import jwt from "express-jwt";

import * as controller from "./controller";

export const appointmentsRouter = express.Router();

/** POST /api/appointments */
appointmentsRouter.route("/").post(jwt(config),controller.create);

/** POST /api/appointments/validate */
appointmentsRouter.route("/validate").post(jwt(config), controller.get);