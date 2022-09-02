import { BpiSubjectType } from "./bpiSubjectType.enum";

export class BpiSubject {
    // Fields of the domain model are always changed through it's methods
    private id: string; // TODO: Add uuid after #491
    private name: string;
    private description: string;
    private type: BpiSubjectType;
    private publicKey: string;

    constructor(init: BpiSubject) {
        Object.assign(this, init);
    }
}
