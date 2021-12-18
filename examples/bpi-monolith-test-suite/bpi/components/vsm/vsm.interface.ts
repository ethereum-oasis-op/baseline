import { Agreement } from "../storage/agreement";
import { Transaction } from "../transactions/transaction";

export interface IVirtualStateMachineComponent {
    executeTransaction(transaction: Transaction): string;
    
    // TODO: Position of this method is not correct. This is just a temporary place until we implement the zk mock and 
    // agree on the mechanism to sign the initial agreement between two parties
    createProof(agreementPreviousState: Agreement, proposedChanges: Agreement, signature: string): string
}