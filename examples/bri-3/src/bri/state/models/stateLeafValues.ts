import { AutoMap } from '@automapper/classes';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';

export class StateLeafValues {
  @AutoMap()
  id: string;

  @AutoMap()
  bpiAccountId: string;

  @AutoMap()
  BpiAccount: BpiAccount;

  @AutoMap()
  leafIndex: number;

  @AutoMap()
  leafValue: string;

  @AutoMap()
  merkelizedPayload: string;

  @AutoMap()
  witness: string;

  constructor(
    id: string,
    bpiAccountId: string,
    BpiAccount: BpiAccount,
    leafIndex: number,
    leafValue: string,
    merkelizedPayload: string,
    witness: string,
  ) {
    this.id = id;
    this.bpiAccountId = bpiAccountId;
    this.BpiAccount = BpiAccount;
    this.leafIndex = leafIndex;
    this.leafValue = leafValue;
    this.merkelizedPayload = merkelizedPayload;
    this.witness = witness;
  }
}
