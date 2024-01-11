import { AutoMap } from '@automapper/classes';
import { v4 } from 'uuid';
import { BpiSubjectRole } from './bpiSubjectRole';
import { PublicKey } from './publicKey';

export class BpiSubject {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  publicKey: {
    ecdsa: string;
    eddsa: string;
  };

  @AutoMap()
  loginNonce: string;

  @AutoMap(() => [BpiSubjectRole])
  roles: BpiSubjectRole[];

  constructor(
    id: string,
    name: string,
    description: string,
    publicKey: PublicKey,
    roles: BpiSubjectRole[],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.publicKey = {
      ecdsa: publicKey.ecdsa,
      eddsa: publicKey.eddsa,
    };
    this.roles = roles;
  }

  public updateName(newName: string): void {
    this.name = newName;
  }

  public updateDescription(newDescription: string): void {
    this.description = newDescription;
  }

  public updatePublicKey(newPk: PublicKey): void {
    this.publicKey = {
      ecdsa: newPk.ecdsa,
      eddsa: newPk.eddsa,
    };
  }

  public updateLoginNonce(): void {
    this.loginNonce = v4();
  }

  public getBpiSubjectDid(): string {
    return `did:ethr:0x5:${this.publicKey.ecdsa}`;
  }
}
