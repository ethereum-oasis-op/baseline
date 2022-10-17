import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export interface WorkflowDto {
  id: string;
  name: string;
  worksteps: Workstep[];
  workgroupId: string;
}
