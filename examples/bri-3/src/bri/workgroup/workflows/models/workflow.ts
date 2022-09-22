import { Workstep } from '../../worksteps/models/workstep';

export class Workflow {
  private _id: string; // TODO: Add uuid after #491
  private _worksteps: Workstep[]; //TODO enforce workstep causal connection through collection order

  constructor(id: string, worksteps: Workstep[]) {
    this._id = id;
    this._worksteps = worksteps;
  }

  public get id(): string {
    return this._id;
  }

  public get worksteps(): Workstep[] {
    return this._worksteps;
  }

  public updateWorksteps(newWorksteps: Workstep[]): void {
    this._worksteps = newWorksteps;
  }
}
