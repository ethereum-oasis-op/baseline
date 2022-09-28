/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from "express";
import { Time } from "../../models/time.model";
import { Op } from "sequelize";
import { ethers, BigNumber } from "ethers";
import { Appointment } from "../../models";

// Create time availablity for the user
export const create = async (req: Request, res: Response, next: NextFunction) => {
	if ((req as any).user.payload.id !== +req.body.userId) {
		console.log("request body", req.body);
		return res.status(401).send({ error: "You can can only access yourself" });
	}
	const { timeStarts, timeEnds, userId } = req.body;
	if (timeStarts.length !== timeEnds.length) {
		return res.status(400).send({ error: "Something went wrong! Please contact developer" });
	}
	try {
		const secret = BigNumber.from(ethers.utils.randomBytes(Math.floor(Math.random() * 100)));

		const times = [];
		for (let i = 0; i < timeStarts.length; i++) {
			times.push({
				timestart: timeStarts[i],
				timeend: timeEnds[i],
				user: userId,
				status: "available"
			});
		}
		const timejson = await Time.bulkCreate(times);
		const appointmentObject = {
			fromUser: userId,
			status: "created",
			secret: secret.toString()
		};
		console.log(appointmentObject);
		const appointment = await Appointment.create(appointmentObject);
		const result = { appointment: appointment, times: timejson };
		return res.status(200).send(result);
	} catch (error) {
		console.log(error);
		return res.status(400);
	}
};

// update time availability for the user.
export const update = async (req: Request, res: Response, next: NextFunction) => {
	if ((req as any).user.payload.id !== +req.params.userId) {
		return res.status(401).send({ error: "You can can only access yourself" });
	}
	const { ids, timeStarts, timeEnds } = req.body;
	if (timeStarts.length !== timeEnds.length) {
		return res.status(400).send({ error: "Something went wrong! Please contact developer" });
	}
	try {
		const times = [];
		for (let i = 0; i < timeStarts.length; i++) {
			times.push({
				id: ids[i],
				timestart: timeStarts[i],
				timeend: timeEnds[i],
				userId: req.params.userId,
				status: "available"
			});
		}
		const timejson = await Time.bulkCreate(times, {
			updateOnDuplicate: ["id"]
		});
		return res.status(200).send(timejson);
	} catch (error) {
		console.log(error);
		return res.status(400);
	}
};
// Get all available times for a person
export const get = async (req: Request, res: Response, next: NextFunction) => {
	if ((req as any).user.payload.id !== +req.params.userId) {
		return res.status(401).send({ error: "You can can only access yourself" });
	}
	try {
		const times = await Time.findAll({
			where: {
				userId: {
					[Op.eq]: req.params.userId
				}
			}
		});
		return res.status(200).send(times);
	} catch (error) {
		console.log(error);
		return res.status(400);
	}
};
