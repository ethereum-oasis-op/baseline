import express from "express";

import { authRouter } from "./auth";
import { userRouter } from "./users";
import { timeRouter } from "./time";
import { circuitRouter } from "./circuit";
import { appointmentsRouter } from "./appointments";
export const services = express.Router();

services.use("/auth", authRouter);
services.use("/users", userRouter);
services.use("/time", timeRouter);
services.use("/circuit", circuitRouter);
services.use("/appointments", appointmentsRouter);