import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';
import { TransactionStatus } from './transactionStatus.enum';
import { AutoMap } from '@automapper/classes';

export class Transaction {
  @AutoMap()
  id: string;

  @AutoMap()
  nonce: number;

  @AutoMap()
  workflowInstanceId: string;

  @AutoMap()
  workstepInstanceId: string;

  fromBpiAccountId: string;

  toBpiAccountId: string;

  @AutoMap()
  FromBpiAccount: BpiAccount;

  @AutoMap()
  ToBpiAccount: BpiAccount;

  @AutoMap()
  payload: string;

  @AutoMap()
  signature: string;

  @AutoMap()
  status: TransactionStatus;

  constructor(
    id: string,
    nonce: number,
    workflowInstanceId: string,
    workstepInstanceId: string,
    from: BpiAccount,
    to: BpiAccount,
    payload: string,
    signature: string,
    status: TransactionStatus,
  ) {
    this.id = id;
    this.nonce = nonce;
    this.workflowInstanceId = workflowInstanceId;
    this.workstepInstanceId = workstepInstanceId;
    this.FromBpiAccount = from;
    this.FromBpiAccount = to;
    this.payload = payload;
    this.signature = signature;
    this.status = status;
  }

  public updatePayload(payload: string, signature: string): void {
    // TODO: Verify signature
    this.payload = payload;
    this.signature = signature;
  }
}
