import { Workstep } from '../../worksteps/models/workstep';

export class Workflow  {
  private id: string; // TODO: Add uuid after #491
  private worksteps: Workstep[]; //TODO enforce workstep causal connection through collection order

  constructors(init: Workflow) {
    Object.assign(this, init);
  };
}
