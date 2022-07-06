import { NextFunction, Request, Response } from "express";
//import { User } from "../../models/user.model";
import { Time } from "../../models/time.model";
import { Op } from "sequelize";

// Create time availablity for the user
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as any).user.payload.id !== +req.body.userId) {
    return res.status(401).send({ error: "You can can only access yourself" });
  }
  const { timeStarts, timeEnds, userId } = req.body;
  if (timeStarts.length !== timeEnds.length) {
    return res
      .status(400)
      .send({ error: "Something went wrong! Please contact developer" });
  }
  const times = [];
  for (let i = 0; i < timeStarts.length; i++) {
    times.push({
      timestart: timeStarts[i],
      timeend: timeEnds[i],
      userId: userId,
      status: "available",
    });
  }
  const timejson = await Time.bulkCreate(times);
  return res.status(200).send(timejson);
};

// update time availability for the user.
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as any).user.payload.id !== +req.params.userId) {
    return res.status(401).send({ error: "You can can only access yourself" });
  }
  const { ids, timeStarts, timeEnds } = req.body;
  if ((req as any).timeStarts.length !== (req as any).timeEnds.length) {
    return res
      .status(400)
      .send({ error: "Something went wrong! Please contact developer" });
  }
  const times = [];
  for (let i = 0; i < timeStarts.length; i++) {
    times.push({
      id: ids[i],
      timestart: timeStarts[i],
      timeend: timeEnds[i],
      userId: req.params.userId,
      status: "available",
    });
  }
  const timejson = await Time.bulkCreate(times, { updateOnDuplicate: ["id"] });
  return res.status(200).send(timejson);
};
// Get all available times for a person
export const get = async (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user.payload.id !== +req.params.userId) {
    return res.status(401).send({ error: "You can can only access yourself" });
  }
  const times = await Time.findAll({
    where: {
      userId: {
        [Op.eq]: req.params.userId,
      },
    },
  });
  return res.status(200).send(times);
};
