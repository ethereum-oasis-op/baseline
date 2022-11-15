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

  @AutoMap()
  loginNonce: string;

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

  public updateName(newName: string): void {
    this.name = newName;
  }

  public updateDescription(newDescription: string): void {
    this.description = newDescription;
  }

  public updatePublicKey(newPk: string): void {
    this.publicKey = newPk;
  }

  public updateLoginNonce(nonce: string): void {
    this.loginNonce = nonce;
  }
}
