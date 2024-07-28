export class CreateTransactionCommand {
  constructor(
    public readonly id: string,
    public readonly nonce: number,
    public readonly workflowId: string,
    public readonly workstepId: string,
    public readonly fromSubjectAccountId: string,
    public readonly toSubjectAccountId: string,
    public readonly payload: string,
    public readonly signature: string,
  ) {}
}
