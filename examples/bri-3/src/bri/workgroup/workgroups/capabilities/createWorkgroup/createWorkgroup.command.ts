export class CreateWorkgroupCommand {
  constructor(
    public readonly name: string,
    public readonly administratorPublicKeys: string[],
    public readonly securityPolicy: string,
    public readonly privacyPolicy: string,
    public readonly participantPublicKeys: string[],
    public readonly workstepIds: string[],
    public readonly workflowIds: string[],
  ) {}
}
