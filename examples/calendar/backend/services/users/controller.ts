import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user.model";

export const get = (req: Request, res: Response, next: NextFunction) => {
	
	return User.findByPk(req.user.payload.id)
		.then((user: User | null) => res.json(user))
		.catch(next);
};

export const create = (req: Request, res: Response, next: NextFunction) =>
	User.create(req.body)
		.then((user: User) => res.json(user))
		.catch(next);


