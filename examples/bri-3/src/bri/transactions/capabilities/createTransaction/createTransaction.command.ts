import { BpiAccount } from '../../../identity/bpiAccounts/models/bpiAccount';

export class CreateTransactionCommand {
  constructor(
    public readonly transactionId: string,
    public readonly nonce: number,
    public readonly workflowInstanceId: string,
    public readonly workstepInstanceId: string,
    public readonly from: BpiAccount,
    public readonly to: BpiAccount,
    public readonly payload: string,
    public readonly signature: string,
  ) {}
}
