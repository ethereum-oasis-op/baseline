import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user.model";

export const create = (req: Request, res: Response, next: NextFunction) => {
  const { token, publicAddress, slot } = req.body;
};
