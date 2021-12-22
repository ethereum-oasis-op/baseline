import { Agreement } from "../storage/agreement";
import { BpiSubject } from "../identity/bpiSubject";

export class Invitation {
    id: string;
    name: string;
    sender: BpiSubject;
    recipient: string;
    workgroupId: string;
    agreement: Agreement;

    constructor(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string, agreement: Agreement) {
        this.id = id;
        this.name = name;
        this.sender = sender;
        this.recipient = recipient;
        this.workgroupId = workgroupId;
        this.agreement = agreement;
    }
}