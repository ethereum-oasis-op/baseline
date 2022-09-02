import { BpiSubjectType } from "./bpiSubjectType.enum";

export class BpiSubject {
    // Fields of the domain model are always changed through it's methods
    private id: string; // TODO: Add uuid after #491
    private name: string;
    private description: string;
    private type: BpiSubjectType;
    private publicKey: string;

    constructor(
        name: string, 
        description: string, 
        type: BpiSubjectType, 
        publicKey: string) {
            this.name = name
            this.description = description
            this.type = type
            this.publicKey = publicKey
    }
    
}
