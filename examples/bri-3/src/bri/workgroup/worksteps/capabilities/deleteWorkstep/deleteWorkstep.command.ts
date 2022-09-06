export class DeleteWorkstepCommand {
  constructor(
    private name: string,
    private id: string,
    private workgroupId: string,
  ) {}
}
