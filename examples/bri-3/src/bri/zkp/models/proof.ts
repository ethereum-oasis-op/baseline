import { AutoMap } from '@automapper/classes';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';

export class Proof {
  @AutoMap()
  id: string;

  @AutoMap()
  owner: BpiAccount;

  @AutoMap()
  payload: string;

  @AutoMap()
  signature: string;

  constructor(
    id: string,
    owner: BpiAccount,
    payload: string,
    signature: string,
  ) {
    this.id = id;
    this.owner = owner;
    this.payload = payload;
    this.signature = signature;
  }
}
