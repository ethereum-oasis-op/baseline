import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export class UpdateWorkflowCommand {
  constructor(private worksteps: Workstep[]) {}

  public get _worksteps(): Workstep[] {
    return this.worksteps;
  }
}
