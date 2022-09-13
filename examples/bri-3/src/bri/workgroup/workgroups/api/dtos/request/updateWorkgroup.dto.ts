import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { Privacy } from 'src/bri/policy/models/privacy';
import { Security } from 'src/bri/policy/models/security';
import { Workflow } from 'src/bri/workgroup/workflows/models/workflow';
import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export interface UpdateWorkgroupDto {
  name: string;
  administrator: BpiSubject[];
  parcitipants: BpiSubject[];
  securityPolicy: Security[];
  privacyPolicy: Privacy[];
  worksteps: Workstep[];
  workflows: Workflow[];
}
