import { AutoMap } from '@automapper/classes';
import { v4 } from 'uuid';
import { BpiSubjectRole } from './bpiSubjectRole';
import { PublicKeyType, PublicKey } from './publicKey';
import { PublicKeyDto } from '../api/dtos/request/publicKey.dto';

export class BpiSubject {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap(() => [PublicKey])
  publicKeys: PublicKey[];

  @AutoMap()
  loginNonce: string;

  @AutoMap(() => [BpiSubjectRole])
  roles: BpiSubjectRole[];
  constructor(
    id: string,
    name: string,
    description: string,
    publicKeys: PublicKey[],
    roles: BpiSubjectRole[],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.publicKeys = publicKeys;
    this.roles = roles;
  }

  public updateName(newName: string): void {
    this.name = newName;
  }

  public updateDescription(newDescription: string): void {
    this.description = newDescription;
  }

  public updatePublicKeys(newPKs: PublicKeyDto[]): void {
    newPKs.map((newKey: PublicKeyDto) => {
      const index = this.publicKeys.findIndex(
        (oldKey: PublicKey) =>
          oldKey.type.toLowerCase() == newKey.type.toLowerCase(),
      );
      this.publicKeys[index].value = newKey.value;
    });
  }

  public updateLoginNonce(): void {
    this.loginNonce = v4();
  }

  public getBpiSubjectDid(): string {
    const ecdsaPublicKey = this.publicKeys.filter(
      (key) => key.type == PublicKeyType.ECDSA,
    )[0];
    return `did:ethr:0x11155111:${ecdsaPublicKey.value}`;
  }
}
