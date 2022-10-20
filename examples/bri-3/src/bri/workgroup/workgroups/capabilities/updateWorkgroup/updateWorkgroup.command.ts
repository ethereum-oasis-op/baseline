export class UpdateWorkgroupCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly administratorIds: string[],
    public readonly securityPolicy: string,
    public readonly privacyPolicy: string,
    public readonly participantIds: string[],
  ) {}
}
