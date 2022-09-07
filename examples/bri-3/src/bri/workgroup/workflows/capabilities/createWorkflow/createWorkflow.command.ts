import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export class CreateWorkflowCommand {
  constructor(private _worksteps: Workstep[]) {}
  public getWorksteps(): Workstep[] {
    return this._worksteps;
  }
  public setWorksteps(value: Workstep[]) {
    this._worksteps = value;
  }
}
