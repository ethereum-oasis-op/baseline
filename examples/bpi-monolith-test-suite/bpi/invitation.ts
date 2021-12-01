import { Agreement } from "./agreement";
import { BpiSubject } from "./bpiSubject";

export class Invitation{
    id: string;
    name: string;
    sender: BpiSubject;
    recipient: string;
    workgroupId: string;
    agreement: Agreement;

    constructor(id:string, name:string, sender: BpiSubject, recipient:string, workgroupId: string, agreement:Agreement){
        this.id = id;
        this.name = name;
        this.sender = sender;
        this.recipient = recipient;
        this.workgroupId = workgroupId;
        this. agreement = agreement;
    }

    sign():[string,string]{
        this.agreement.signature = true;
        return ["BO1","BobOrganisation"];
    }
    
}