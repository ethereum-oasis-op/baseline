import { IWorkstep } from "./workstep.interface";
import { Agreement } from "../../Agreement";

export class Workstep implements IWorkstep {
    name: string;
    id: string; 
    status: string; 
    businessLogicToExecute: any;

    constructor(id: string, name: string) {

    }
    setBusinessLogicToExecute(businessLogicToExecute: any) {
        return 
    }
    execute(currentState: Agreement, stateChangeObject: any): string {
        return 
    }
}