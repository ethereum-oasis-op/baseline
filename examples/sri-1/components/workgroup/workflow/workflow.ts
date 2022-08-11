import { IWorkflow } from './workflow.interface';
import { Workstep } from '../workstep/workstep';

export class Workflow implements IWorkflow {
  id: string; //[R234] A workflow with more than one workstep MUST have a unique identifier within a BPI.
  Worksteps: Workstep[] = []; //[R233] If there is more than one workstep in a workflow, the worksteps in a workflow MUST be causally connected.This means that the output of a workstep in a workflow is a required input into one or more subsequent worksteps. //TODO Worksteps connected causally by order in workflow? or alternative causal connection [R233]

  constructors(id: string, worksteps: Workstep[]) {
    this.id = id;
    this.Worksteps = worksteps; //[R231] A workflow MUST contain at least one workstep.
  };
}

/**[R232] //TODO Implement all applicable workstep requirements here
All requirements for a workstep MUST also be applied to a workflow.
This means that requirements such as determinism, ability to be updated, versioning, characteristics of zero-knowledge proofs, etc. also apply to a workflow.

[R235] //TODO enforce sequential execution of worksteps within workflow (in workgroup)
A workflow with more than one workstep and a given set of inputs MUST be sequentially executed by a BPI.
This simply means that for a given set of inputs there is only one process path through a given workflow. 
*/