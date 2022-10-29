import { TransactionStatus } from './transactionStatus.enum';
import { AutoMap } from '@automapper/classes';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';

export class Transaction {
  @AutoMap()
  id: string;

  @AutoMap()
  nonce: number;

  @AutoMap()
  workflowInstanceId: string;

  @AutoMap()
  workstepInstanceId: string;

  fromBpiSubjectAccountId: string;

  toBpiSubjectAccountId: string;

  @AutoMap(() => BpiSubjectAccount)
  fromBpiSubjectAccount: BpiSubjectAccount;

  @AutoMap(() => BpiSubjectAccount)
  toBpiSubjectAccount: BpiSubjectAccount;

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
    fromBpiSubjectAccount: BpiSubjectAccount,
    toBpiSubjectAccount: BpiSubjectAccount,
    payload: string,
    signature: string,
    status: TransactionStatus,
  ) {
    this.id = id;
    this.nonce = nonce;
    this.workflowInstanceId = workflowInstanceId;
    this.workstepInstanceId = workstepInstanceId;
    this.fromBpiSubjectAccount = fromBpiSubjectAccount;
    this.fromBpiSubjectAccountId = fromBpiSubjectAccount.id;
    this.toBpiSubjectAccount = toBpiSubjectAccount;
    this.toBpiSubjectAccountId = toBpiSubjectAccount.id;
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
