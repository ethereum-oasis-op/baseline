/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from "express";
import { Time } from "../../models/time.model";
import { Appointment } from "../../models/appointment.model";
import { Op } from "sequelize";
import {Status} from "./../../db";
// Create time availablity for the user
export const create = async (req: Request, res: Response, next: NextFunction) => {
	console.log("req", req.body);
	const { timeStarts, timeEnds } = req.body.availableTimes;
	if (!(req as any).hasOwnProperty("user")) {
		return res.status(401).send({ error: "No User found!" });
	}
	const userId = (req as any).user.payload.id;
	if (timeStarts !== undefined && timeEnds !==undefined && timeStarts.length !== timeEnds.length) {
		return res.status(400).send({ error: "The length of startimes and endtimes should match!" });
	}
	try {
		const times = [];
		for (let i = 0; i < timeStarts.length; i++) {
			times.push({
				timeStart: timeStarts[i],
				timeEnd: timeEnds[i],
				user: userId,
				status: Status.available
			});
		}
		const timejson = await Time.bulkCreate(times);
		const result = { times: timejson };
		return res.status(200).send(result);
	} catch (error) {
		console.log(error);
		return res.status(400);
	}
};

export const fewTimes  = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {secret} = req.body;
		const appointment = await Appointment.findOne({ where: { secret: secret }, limit: 1 });
		const userId = appointment?.fromUser;
		const times = await Time.findAll({
			where: {
				timeStart: {
					[Op.gte]: Date.now()
				},
				user: {
					[Op.eq]: userId
				}
			},
			limit: 5
		});
		
		return res.status(200).send(times);

	}catch(error){
		console.log("error", error);
		return res.status(400);
	}
};

// Get all available times for a person
export const get = async (req: Request, res: Response, next: NextFunction) => {
	
	try {
		const userId = (req as any).user.payload.id;
		const times = await Time.findAll({
			where: {
				user: {
					[Op.eq]: userId
				}
			}
		});
		console.log("Times", times);
		return res.status(200).send(times);
	} catch (error) {
		console.log(error);
		return res.status(400);
	}
};
