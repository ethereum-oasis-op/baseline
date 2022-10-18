import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { Workflow } from 'src/bri/workgroup/workflows/models/workflow';
import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export interface WorkgroupDto {
  id: string;
  name: string;
  administrators: BpiSubject[];
  securityPolicy: string;
  privacyPolicy: string;
  participants: BpiSubject[];
  worksteps: Workstep[];
  workflows: Workflow[];
}
