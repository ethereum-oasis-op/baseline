import { NextFunction, Request, Response } from "express";
import { Appointment } from "../../models";
import { ethers, BigNumber } from "ethers";

export const create = async (req: Request, res: Response, next: NextFunction) => {
	if (!(req as any).hasOwnProperty("user")) {
		return res.status(401).send({ error: "No User found!" });
	}
	try {
		const secret = BigNumber.from(ethers.utils.randomBytes(Math.floor(Math.random() * 100)));
		const userId = (req as any).user.payload.id;
		const appointmentObject = {
			fromUser: userId,
			status: "created",
			secret: secret.toString()
		};
		const appointment = await Appointment.create(appointmentObject);
		const result = {appointment: appointment};
		return res.status(200).send(result);
	} catch (error) {
		console.log(error);
		return res.status(400);
	}
	
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { secret } = req.body;
		const appointment = await Appointment.findOne({ where: { secret: secret }, limit: 1 });
		const result = {appointment: appointment};
		return res.status(200).send(result);
	} catch (error) {
		console.log(error);
		return res.status(400);
	}
	
};

