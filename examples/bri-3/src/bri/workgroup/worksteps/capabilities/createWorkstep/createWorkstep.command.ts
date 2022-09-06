export class CreateWorkstepCommand {
  constructor(
    private name: string,
    private id: string,
    private workgroupId: string,
  ) {}
}
