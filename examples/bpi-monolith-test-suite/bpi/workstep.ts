export class Workstep { 
    name: String;
    id: String;
    status: String;
    agreementFunction: any;
    execute(stateObject: any ) {
        return this.agreementFunction(stateObject);
    }

}