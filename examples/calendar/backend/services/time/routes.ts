import express from "express";
import { config } from "../../config";
import jwt from "express-jwt";

import * as controller from "./controller";

export const timeRouter = express.Router();

/** POST /api/time */
timeRouter.route("/").post(jwt(config), controller.create);

/** PUT /api/time */
timeRouter.route("/").put(jwt(config), controller.update);

/** GET /api/time */
timeRouter.route("/:userId").get(jwt(config), controller.get);
