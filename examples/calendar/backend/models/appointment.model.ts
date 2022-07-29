import { Model } from "sequelize";

export class Appointment extends Model {
  public id!: number;
  public fromUser!: string;
  public toUser!: string;
  public timeStart!: number;
  public timeEnd!: number;
  public status!: string;
}
