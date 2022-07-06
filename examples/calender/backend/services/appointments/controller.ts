import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user.model";

export const create = (req: Request, res: Response, next: NextFunction) => {
  const { token, publicAddress, slot } = req.body;
};

export const find = (req: Request, res: Response, next: NextFunction) => {
  // If a query string ?publicAddress=... is given, then filter results
  const whereClause =
    req.query && req.query.publicAddress
      ? {
          where: { publicAddress: req.query.publicAddress },
        }
      : undefined;

  return User.findAll(whereClause)
    .then((users: User[]) => res.json(users))
    .catch(next);
};
