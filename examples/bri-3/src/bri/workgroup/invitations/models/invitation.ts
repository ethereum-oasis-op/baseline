import { BpiSubject } from "../../../identity/bpiSubjects/models/bpiSubject";

export class Invitation {
    id: string; // TODO: Add uuid after #491
    name: string;
    sender: BpiSubject;
    recipient: string;
    workgroupId: string;

    constructor(init : Invitation) {
        Object.assign(this, init);
    }
}
