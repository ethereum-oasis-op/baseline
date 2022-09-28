import { Model } from "sequelize";

export class Appointment extends Model {
	public id!: number;
	public fromUser!: number;
	public toUser?: number;
	public status?: string;
	public secret?: string;
}
