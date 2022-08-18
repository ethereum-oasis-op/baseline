import { BpiSubject } from "../../identity/bpiSubject/bpiSubject";
import { TInvitation } from "./invitation.type";

export class Invitation implements TInvitation {
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