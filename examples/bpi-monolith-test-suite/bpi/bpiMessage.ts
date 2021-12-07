import { BpiSubject } from "./bpiSubject";

export class BpiMessage {
    id: string;
    type: string;
    sender: BpiSubject;
    receiver: BpiSubject;
    workgroupId: string;
    payload: any;
    senderSignature: string;
    executionProof: string;

    constructor(id: string, type: string, sender: BpiSubject, receiver: BpiSubject, workgroupId: string, payload: any) {
        this.id = id;
        this.type = type;
        this.sender = sender;
        this.receiver = receiver;
        this.workgroupId = workgroupId;
        this.payload = payload;
    }

    setExecutionProof(proof: string) {
        this.executionProof = proof;
    }
}