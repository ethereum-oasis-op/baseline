import { AutoMap } from '@automapper/classes';
import { BpiSubjectType } from './bpiSubjectType.enum';

export class BpiSubject {

  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  type: BpiSubjectType;
  
  @AutoMap()
  publicKey: string;

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

  // @AutoMap()
  // public get id(): string {
  //   return this._id;
  // }

  // public set id(id: string) {
  //   this._id = id;
  // }

  // @AutoMap()
  // public get name(): string {
  //   return this._name;
  // }

  // public set name(name: string)  {
  //   this._name = name;
  // }

  // @AutoMap()
  // public get description(): string {
  //   return this._description;
  // }

  // public set description(description: string)  {
  //   this._description = description;
  // }

  // @AutoMap()
  // public get type(): BpiSubjectType {
  //   return this._type;
  // }

  // public set type(type: BpiSubjectType)  {
  //   this._type = type;
  // }

  // @AutoMap()
  // public get publicKey(): string {
  //   return this._publicKey;
  // }

  // public set publicKey(publicKey: string)  {
  //   this._publicKey = publicKey;
  // }

  public updateName(newName: string): void {
    this.name = newName;
  }

  public updateDescription(newDescription: string): void {
    this.description = newDescription;
  }

  public updatePublicKey(newPk: string): void {
    this.publicKey = newPk;
  }
}
