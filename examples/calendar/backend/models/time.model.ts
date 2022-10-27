import { Model } from "sequelize";

export class Time extends Model {
	public id!: number; // Note that the `null assertion` `!` is required in strict mode.
	public timeStart!: number;
	public timeEnd!: number;
	public user?: number; // for nullable fields
	public status?: string;
	public secret?: string;
}
