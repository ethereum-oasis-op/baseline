import { Privacy } from '../policy/privacy';
import { Security } from '../policy/security';
import { Agreement } from '../storage/agreement';

export interface IWorkstep {
    name: string;
    id: string; //[R217] A workstep MUST have a unique identifier within a BPI.
    workgroupId: string; //[R215] A workstep instance MUST be associated with only one workgroup.
    version: string; //[R220] A workstep MUST be versioned within a BPI.
    status: string; //[R219] A workstep instance MUST NOT be updated while the workstep is being executed by the BPI.
    businessLogicToExecute: any; //[R211] A workstep MUST have an input, one or more process steps, and an output.This is just a well-known convention from business process management frameworks.
    securityPolicy: Security[]; //[R216] A workstep instance MUST inherit the security and privacy policies of its associated workgroup. 
    privacyPolicy: Privacy[]; //[R216] A workstep instance MUST inherit the security and privacy policies of its associated workgroup.  
    setBusinessLogicToExecute(businessLogicToExecute: any) //[R218] A workstep MUST be updatable.
    execute(currentState: Agreement, stateChangeObject: any): string 
    //[R211] A workstep MUST have an input, one or more process steps, and an output.This is just a well-known convention from business process management frameworks.
    //[R212] The input of a workstep MUST represent a new, proposed state of a state object compliant with the agreement between the agreement counterparties 
    //[R221] A workstep MUST be executed by a BPI.
    //[R223] A workstep MUST be deterministic. 
}
