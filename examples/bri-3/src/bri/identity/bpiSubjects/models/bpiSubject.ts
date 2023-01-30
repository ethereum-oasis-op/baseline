import { AutoMap } from '@automapper/classes';
import { v4 } from 'uuid';

export enum BpiSubjectRoleName {
  INTERNAL_BPI_SUBJECT = 'INTERNAL_BPI_SUBJECT',
  EXTERNAL_BPI_SUBJECT = 'EXTERNAL_BPI_SUBJECT',
}

export class BpiSubjectRole {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap()
  name: BpiSubjectRoleName;

  @AutoMap()
  description: string;

  constructor(id: string, name: BpiSubjectRoleName, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

export class BpiSubject {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  publicKey: string;

  @AutoMap()
  loginNonce: string;

  @AutoMap(() => [BpiSubjectRole])
  roles: BpiSubjectRole[];

  constructor(
    id: string,
    name: string,
    description: string,
    publicKey: string,
    roles: BpiSubjectRole[],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.publicKey = publicKey;
    this.roles = roles;
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

  public updateLoginNonce(): void {
    this.loginNonce = v4();
  }

  public getBpiSubjectDid(): string {
    return `did:ethr:0x5:${this.publicKey}`;
  }
}
