export class UpdateWorkstepCommand {
  constructor(
    public readonly name: string,
    public readonly version: string,
    public readonly status: string,
    public readonly workgroupId: string,
  ) {}
}
