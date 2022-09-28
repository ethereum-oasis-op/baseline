import express from "express";

import * as controller from "./controller";

export const appointmentsRouter = express.Router();

/** POST /api/appointments */
appointmentsRouter.route("/").post(controller.create);
