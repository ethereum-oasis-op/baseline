import express from "express";

import { authRouter } from "./auth";
import { userRouter } from "./users";
import { timeRouter } from "./time";
import { appointmentsRouter } from "./appointments";
export const services = express.Router();

services.use("/auth", authRouter);
services.use("/users", userRouter);
services.use("/time", timeRouter);
services.use("/appointments", appointmentsRouter);
