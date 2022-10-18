export class CreateWorkgroupCommand {
  constructor(
    public readonly name: string,
    public readonly administratorIds: string[],
    public readonly securityPolicy: string,
    public readonly privacyPolicy: string,
    public readonly participantIds: string[],
    public readonly workstepIds: string[],
    public readonly workflowIds: string[],
  ) {}
}
