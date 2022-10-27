import express from "express";

import * as controller from "./controller";

export const circuitRouter = express.Router();

/** POST /api/proof */
circuitRouter.route("/proof").post(controller.proof);

/** GET /api/verify */
circuitRouter.route("/verify").post(controller.verify);
