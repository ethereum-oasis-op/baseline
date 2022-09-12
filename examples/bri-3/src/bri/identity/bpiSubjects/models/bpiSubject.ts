import { BpiSubjectType } from './bpiSubjectType.enum';

export class BpiSubject {
  // Fields of the domain model are always changed through it's methods
  private _id: string; // TODO: Add uuid after #491
  private _name: string;
  private _description: string;
  private _type: BpiSubjectType;
  private _publicKey: string;

  constructor(
    id: string,
    name: string,
    description: string,
    type: BpiSubjectType,
    publicKey: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.publicKey = publicKey;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get description(): string {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }

  public get type(): BpiSubjectType {
    return this._type;
  }
  public set type(value: BpiSubjectType) {
    this._type = value;
  }
  
  public get publicKey(): string {
    return this._publicKey;
  }
  public set publicKey(value: string) {
    this._publicKey = value;
  }
}
