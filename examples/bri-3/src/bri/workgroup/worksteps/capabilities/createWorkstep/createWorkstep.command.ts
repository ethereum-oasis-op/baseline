import { Privacy } from 'src/bri/policy/models/privacy';
import { Security } from 'src/bri/policy/models/security';

export class CreateWorkstepCommand {
  constructor(
    public readonly name: string,
    public readonly version: string,
    public readonly status: string,
    public readonly workgroupId: string,
    public readonly securityPolicy: Security,
    public readonly privacyPolicy: Privacy,
  ) {}
}
