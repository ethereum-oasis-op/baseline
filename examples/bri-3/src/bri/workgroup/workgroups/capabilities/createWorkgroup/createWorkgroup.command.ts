import { BpiSubject } from '../../../../identity/bpiSubjects/models/bpiSubject';

export class CreateWorkgroupCommand {
  constructor(
    public readonly bpiSubject: BpiSubject,
    public readonly name: string,
    public readonly securityPolicy: string,
    public readonly privacyPolicy: string,
    public readonly workstepIds: string[],
    public readonly workflowIds: string[],
  ) {}
}
