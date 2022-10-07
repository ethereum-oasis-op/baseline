/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from "express";
import { Time } from "../../models/time.model";
import { Op } from "sequelize";

// Create time availablity for the user
export const create = async (req: Request, res: Response, next: NextFunction) => {
	const { timeStarts, timeEnds } = req.body;
	if (!(req as any).hasOwnProperty("user")) {
		return res.status(401).send({ error: "No User found!" });
	}
	const userId = (req as any).user.payload.id;
	if (timeStarts.length !== timeEnds.length) {
		return res.status(400).send({ error: "The length of startimes and endtimes should match!" });
	}
	try {
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
		const result = { times: timejson };
		return res.status(200).send(result);
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
