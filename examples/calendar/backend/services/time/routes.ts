import express from "express";
import { config } from "../../config";
import jwt from "express-jwt";

import * as controller from "./controller";

export const timeRouter = express.Router();

/** POST /api/time */
timeRouter.route("/").post(jwt(config), controller.create);

/** GET /api/time */
timeRouter.route("/:userId").get(jwt(config), controller.get);
