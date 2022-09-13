import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { Privacy } from 'src/bri/policy/models/privacy';
import { Security } from 'src/bri/policy/models/security';
import { Workflow } from 'src/bri/workgroup/workflows/models/workflow';
import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export class CreateWorkgroupCommand {
  constructor(
    public readonly name: string,
    public readonly administrator: BpiSubject[],
    public readonly securityPolicy: Security[],
    public readonly privacyPolicy: Privacy[],
    public readonly participants: BpiSubject[],
    public readonly worksteps: Workstep[],
    public readonly workflows: Workflow[],
  ) {}
}
