export class UpdateWorkflowCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly workstepIds: string[],
    public readonly workgroupId: string,
  ) {}
}
