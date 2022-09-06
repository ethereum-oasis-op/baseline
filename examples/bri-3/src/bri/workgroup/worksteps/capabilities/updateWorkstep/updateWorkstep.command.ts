export class UpdateWorkstepCommand {
  constructor(
    private name: string,
    private id: string,
    private workgroupId: string,
  ) {}
}
