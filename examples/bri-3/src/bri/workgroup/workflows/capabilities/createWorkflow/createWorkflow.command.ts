export class CreateWorkflowCommand {
  constructor(
    public readonly name: string,
    public readonly workgroupId: string,
    public readonly workstepIds: string[],
  ) {}
}
