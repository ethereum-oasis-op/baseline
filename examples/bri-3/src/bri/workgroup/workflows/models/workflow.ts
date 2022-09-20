import { Workstep } from '../../worksteps/models/workstep';

export class Workflow  {
  private id: string; // TODO: Add uuid after #491
  private worksteps: Workstep[]; //TODO enforce workstep causal connection through collection order

  constructor(id: string, worksteps: Workstep[]) {
    this.id = id
    this.worksteps = worksteps
  }
}
