import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user.model";
import { Logger } from "tslog";

const log: Logger = new Logger({ name: "errorLogger" });



export const find = async (req: Request, res: Response, next: NextFunction) => {
	if (!(req as any).query.hasOwnProperty("publicAddress")) {
		return res.status(401).send({ error: "Please send Address!" });
	}
	return res.status(200).send(await User.findAll({where: { publicAddress: req.query.publicAddress }}));
};

export const get = (req: Request, res: Response, next: NextFunction) => {
	if (!(req as any).hasOwnProperty("user") && !(req as any).user.hasOwnProperty("payload") && !(req as any).user.payload.hasOwnProperty("id")) {
		return res.status(401).send({ error: "No User found!" });
	}

	return User.findByPk((req as any).user.payload.id)
		.then((user: User | null) => res.json(user))
		.catch(next);
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {publicAddress} = req.body;
		const userObject = {
			publicAddress: publicAddress ,
			username: Math.random().toString(36).slice(2, 7),			
		};
		const user = await User.create(userObject);
		const result = {user: user};
		return res.status(200).send(result);
	} catch (error) {
		log.error(error);
		return res.status(400);
	}
};

