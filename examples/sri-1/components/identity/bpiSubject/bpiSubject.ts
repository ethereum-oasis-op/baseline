import { IBpiSubject } from "./bpiSubject.interface";
import { BpiSubjectType } from "./bpiSubjectType.enum";

export class BpiSubject implements IBpiSubject {
    id: string;
    name: string;
    description: string;
    type: BpiSubjectType;
    publicKey: string;

    constructor(id: string, name: string, description: string, type: BpiSubjectType, publicKey: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.publicKey = publicKey;
    }
}