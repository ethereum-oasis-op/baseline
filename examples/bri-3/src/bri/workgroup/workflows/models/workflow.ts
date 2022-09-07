import { IWorkflow } from './workflow.interface';
import { Workstep } from '../../worksteps/models/workstep';

export class Workflow implements IWorkflow {
  id: string; // TODO: Add uuid after #491
  worksteps: Workstep[] = []; //TODO enforce workstep causal connection through collection order

  constructor(worksteps: Workstep[]) {
    this.worksteps = worksteps;
  }
}
