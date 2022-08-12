import { Workstep } from '../workstep/workstep';

export interface IWorkflow {
    id: string; // TODO: Add uuid after #491
    worksteps: Workstep[]; 
} 
