import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export class CreateWorkflowCommand {
  constructor(public readonly worksteps: Workstep[]) {}
}
