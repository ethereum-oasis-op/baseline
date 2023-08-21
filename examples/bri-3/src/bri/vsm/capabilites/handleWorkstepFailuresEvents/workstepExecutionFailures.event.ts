export class WorkstepExecutionFailuresEvent {
  constructor(
    public readonly id: string,
    public readonly err: string,
    public readonly fromBpiSubjectAccountId: string,
    public readonly toBpiSubjectAccountId: string,
    public readonly signature: string,
    public readonly initiatorChannel: string,
  ) {}
}
