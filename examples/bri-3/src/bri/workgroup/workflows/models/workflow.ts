import { Workstep } from '../../worksteps/models/workstep';

export class Workflow {
  private id: string; // TODO: Add uuid after #491
  private worksteps: Workstep[]; //TODO enforce workstep causal connection through collection order

  constructor(worksteps: Workstep[]) {
    this.worksteps = worksteps;
  }
}
