import { Agreement } from "../storage/agreement";
import { BpiSubject } from "../identity/bpiSubject";
export interface IInvitation {
    id: string; 
    name: string;
    sender: BpiSubject;
    recipient: string;
    workgroupId: string;
    agreement: Agreement;
}
