import { Agreement } from "./agreement";

export class Workstep {
    name: string;
    id: string;
    status: string;
    businessLogicToExecute: any;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    setBusinessLogicToExecute(businessLogicToExecute: any) {
        this.businessLogicToExecute = businessLogicToExecute;
    }

    execute(currentState: Agreement, stateChangeObject: any) {
        // TODO: Hack to have the function execute in the context of the agreement object
        return this.businessLogicToExecute.call(currentState, stateChangeObject);
    }

}