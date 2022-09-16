export class CreateWorkstepCommand {
  constructor(
    public readonly name: string,
    public readonly version: string,
    public readonly status: string,
    public readonly workgroupId: string,
    public readonly securityPolicy: string,
    public readonly privacyPolicy: string,
  ) {}
}
