import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export class CreateWorkflowCommand {
  constructor(private worksteps: Workstep[]) {}
  public get _worksteps(): Workstep[] {
    return this.worksteps;
  }
  public set _worksteps(worksteps: Workstep[]) {
    this.worksteps = worksteps;
  }
}
