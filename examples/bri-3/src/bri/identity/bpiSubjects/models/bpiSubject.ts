import { BpiSubjectType } from "./bpiSubjectType.enum";

export class BpiSubject {
    // Fields of the domain model are always changed through it's methods
    id: string; // TODO: Add uuid after #491
    name: string;
    description: string;
    type: BpiSubjectType;
    publicKey: string;

    constructor(init: BpiSubject) {
        Object.assign(this, init);
    }
}
