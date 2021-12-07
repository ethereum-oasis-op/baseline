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

    execute(stateObject: any) {
        return this.businessLogicToExecute(stateObject);
    }

}