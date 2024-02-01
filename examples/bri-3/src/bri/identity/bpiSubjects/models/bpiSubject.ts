import { AutoMap } from '@automapper/classes';
import { v4 } from 'uuid';
import { BpiSubjectRole } from './bpiSubjectRole';
import { KeyType, PublicKey } from './publicKey';

export class BpiSubject {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  publicKey: PublicKey[];

  @AutoMap()
  loginNonce: string;

  @AutoMap(() => [BpiSubjectRole])
  roles: BpiSubjectRole[];
  constructor(
    id: string,
    name: string,
    description: string,
    publicKey: PublicKey[],
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

  public updatePublicKey(newPk: PublicKey): void {
    this.publicKey.map((key) => (key.type == newPk.type ? (key = newPk) : key));
  }

  public updateLoginNonce(): void {
    this.loginNonce = v4();
  }

  public getBpiSubjectDid(): string {
    const ecdsaPublicKey = this.publicKey.filter(
      (key) => key.type == KeyType.ECDSA,
    )[0];
    return `did:ethr:0x5:${ecdsaPublicKey.value}`;
  }
}
