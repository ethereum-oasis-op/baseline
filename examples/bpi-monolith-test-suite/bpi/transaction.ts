import { Order } from "../domain-objects/order";
import { BpiSubject } from "./bpiSubject";

export class Transaction {
    workflowId: string;
    workstepId: string;
    transactionId: string;
    //deterministic nonce? [R258]
    from: BpiSubject;
    to: BpiSubject;
    stateObject: Order;
    ownerSignature: string;
    errorMessage: string;
    errorCode: string;

    constructor(workflowId: string, workstepId: string, transactionId: string, from: BpiSubject, to: BpiSubject, stateObject: Order, ownerSignature: string) {
        this.workflowId = workflowId;
        this.workstepId = workstepId;
        this.transactionId = transactionId;
        this.from = from;
        this.to = to;
        this.stateObject = stateObject;
        this.ownerSignature = ownerSignature;
    }
}
