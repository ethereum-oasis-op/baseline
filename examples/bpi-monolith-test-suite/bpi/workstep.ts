export class Workstep { 
    name: string;
    id: string;
    status: string;
    agreementFunction: any;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    execute(stateObject: any ) {
        return this.agreementFunction(stateObject);
    }

}