export class CreateBpiSubjectAccountCommand {
  constructor(
    public readonly creatorBpiSubjectId: string,
    public readonly ownerBpiSubjectId: string,
  ) {}
}
