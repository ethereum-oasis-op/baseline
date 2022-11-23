import { AutoMap } from '@automapper/classes';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';

export class CCSMAnchorHash {
  @AutoMap()
  id: string;

  @AutoMap()
  owner: BpiSubjectAccount;

  @AutoMap()
  agreementState: BpiAccount;

  @AutoMap()
  hash: string;

  @AutoMap()
  signature: string;

  constructor(
    id: string,
    owner: BpiSubjectAccount,
    agreementState: BpiAccount,
    hash: string,
    signature: string,
  ) {
    this.id = id;
    this.owner = owner;
    this.agreementState = agreementState;
    this.hash = hash;
    this.signature = signature;
  }
}
