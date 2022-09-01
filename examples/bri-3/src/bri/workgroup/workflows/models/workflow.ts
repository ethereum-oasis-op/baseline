import { Workstep } from '../../worksteps/models/workstep';

export class Workflow  {
  id: string; // TODO: Add uuid after #491
  worksteps: Workstep[]; //TODO enforce workstep causal connection through collection order

  constructors(init: Workflow) {
    Object.assign(this, init);
  };
}
