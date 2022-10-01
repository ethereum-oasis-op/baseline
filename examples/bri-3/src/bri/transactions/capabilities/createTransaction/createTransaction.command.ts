export class CreateTransactionCommand {
  constructor(
    public readonly transactionId: string,
    public readonly nonce: number,
    public readonly workflowInstanceId: string,
    public readonly workstepInstanceId: string,
    public readonly fromAccountId: string,
    public readonly toAccountId: string,
    public readonly payload: string,
    public readonly signature: string,
  ) {}
}
