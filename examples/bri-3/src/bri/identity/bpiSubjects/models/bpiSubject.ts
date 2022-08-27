import { IBpiSubject } from "./bpiSubject.interface";
import { BpiSubjectType } from "./bpiSubjectType.enum";

export class BpiSubject implements IBpiSubject {
    // Fields of the domain model are always changed through it's methods
    id: string; // TODO: Add uuid after #491
    name: string;
    description: string;
    type: BpiSubjectType;
    publicKey: string;

    constructor(name: string, description: string, type: BpiSubjectType, publicKey: string) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.publicKey = publicKey;
    }
}