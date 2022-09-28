import { NextFunction, Request, Response } from "express";
import { Appointment } from "../../models";
import { ethers, BigNumber } from "ethers";
export const create = (req: Request, res: Response, next: NextFunction) => {
	try {
		const secret = BigNumber.from(ethers.utils.randomBytes(Math.floor(Math.random() * 100)));
		const userId = req.user.payload.id;
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
