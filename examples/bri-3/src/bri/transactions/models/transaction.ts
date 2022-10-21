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

  //@AutoMap()
  fromBpiAccount: BpiAccount;

  //@AutoMap()
  toBpiAccount: BpiAccount;

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
    fromBpiAccount: BpiAccount,
    toBpiAccount: BpiAccount,
    payload: string,
    signature: string,
    status: TransactionStatus,
  ) {
    this.id = id;
    this.nonce = nonce;
    this.workflowInstanceId = workflowInstanceId;
    this.workstepInstanceId = workstepInstanceId;
    this.fromBpiAccount = fromBpiAccount;
    this.toBpiAccount = toBpiAccount;
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
