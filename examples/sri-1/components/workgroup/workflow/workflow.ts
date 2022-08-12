import { IWorkflow } from './workflow.interface';
import { Workstep } from '../workstep/workstep';

export class Workflow implements IWorkflow {
  id: string; // TODO: Add uuid after #491
  Worksteps: Workstep[] = []; //TODO enforce workstep causal connection through collection order

  constructors(id: string, worksteps: Workstep[]) {
    this.id = id;
    this.Worksteps = worksteps;
  };
}
