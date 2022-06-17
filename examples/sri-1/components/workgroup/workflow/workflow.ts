import { IWorkflow } from "./workflow.interface";
import { Workstep } from "../workstep/workstep";
export class Workflow implements IWorkflow {
    id: string;
    Worksteps: Workstep[] = []; //Worksteps connected casually by order in workflow? or alternative casual connection [R233]

    //[R231] A workflow MUST contain at least one workstep.
    constructors(id: string, worksteps: Workstep[]) {
        
    } 
    
}