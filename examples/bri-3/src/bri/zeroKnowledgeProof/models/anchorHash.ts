import { AutoMap } from '@automapper/classes';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';

export class AnchorHash {
  @AutoMap()
  id: string;

  @AutoMap()
  owner: BpiAccount;

  @AutoMap()
  hash: string;

  @AutoMap()
  signature: string;

  constructor(id: string, owner: BpiAccount, hash: string, signature: string) {
    this.id = id;
    this.owner = owner;
    this.hash = hash;
    this.signature = signature;
  }
}
