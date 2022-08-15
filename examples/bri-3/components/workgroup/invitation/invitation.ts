import { BpiSubject } from "../identity/bpiSubject";
import { IInvitation } from "./invitation.interface";

export class Invitation implements IInvitation {
    id: string; // TODO: Add uuid after #491
    name: string;
    sender: BpiSubject;
    recipient: string;
    workgroupId: string;

    constructor(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string) {
        this.id = id;
        this.name = name;
        this.sender = sender;
        this.recipient = recipient;
        this.workgroupId = workgroupId;
    }
}