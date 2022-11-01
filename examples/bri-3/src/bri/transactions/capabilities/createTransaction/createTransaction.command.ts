export class CreateTransactionCommand {
  constructor(
    public readonly id: string,
    public readonly nonce: number,
    public readonly workflowInstanceId: string,
    public readonly workstepInstanceId: string,
    public readonly fromSubjectAccountId: string,
    public readonly toSubjectAccountId: string,
    public readonly payload: string,
    public readonly signature: string,
  ) {}
}
