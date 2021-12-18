import { Order } from "../../../domain-objects/order";
import { BpiSubject } from "../identity/bpiSubject";

export class Transaction {
    workgroupId: string;
    workstepId: string;
    transactionId: string;
    //deterministic nonce? [R258]
    from: BpiSubject;
    to: BpiSubject;
    stateObject: Order;
    ownerSignature: string;
    errorMessage: string;
    errorCode: string;

    constructor(workgroupId: string, workstepId: string, transactionId: string, nonce: number, from: BpiSubject, to: BpiSubject, stateObject: Order, ownerSignature: string) {
        this.workgroupId = workgroupId;
        this.workstepId = workstepId;
        this.transactionId = transactionId;
        this.from = from;
        this.to = to;
        this.stateObject = stateObject;
        this.ownerSignature = ownerSignature;
    }
}
