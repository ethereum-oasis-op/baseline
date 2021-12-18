import { BpiMessage } from "../../bpiMessage";
import { Transaction } from "../.././transaction";
import { IIdentityComponent } from "../identity/identity.interface";
import { ITransactionPoolComponent } from "./transactionPool.interface";

export class TransactionPoolComponent implements ITransactionPoolComponent {
    identityComponent: IIdentityComponent;
    transactions: Transaction[] = [];

    constructor(identityComponent: IIdentityComponent) {
        this.identityComponent = identityComponent;
    }

    convertMessageToTransaction(message: BpiMessage): Transaction {
        const senderOrg = this.identityComponent.getOrganizationById(message.sender.id);
        
        const nonceForTransaction = senderOrg.getNonce() + 1;

        return new Transaction(message.workgroupId, message.workstepId, message.id, nonceForTransaction, message.sender, message.receiver, message.payload, message.senderSignature);
    }

    validateTransaction(transaction: Transaction): BpiMessage {
        let status: boolean = true;
        const orgAlice = this.identityComponent.getOrganizationById(transaction.from.id);
        const orgBob = this.identityComponent.getOrganizationById(transaction.to.id);
        //R[262]
        //Todo: verify owners signature in transaction
        if (transaction.workflowId === "") {
            transaction.errorCode = "0001";
            transaction.errorMessage += "Invalid workflow Id\n";
            status = false;
        }
        else if (transaction.workstepId === "") {
            transaction.errorCode = "0001";
            transaction.errorMessage += "Invalid workstep Id\n";
            status = false;
        }
        else if (orgAlice === undefined) {
            transaction.errorCode = "0001";
            transaction.errorMessage += "Invalid sender Id\n";
            status = false;
        }
        else if (orgBob === undefined) {
            transaction.errorCode = "0001";
            transaction.errorMessage += "Invalid reciever Id\n";
            status = false;
        }
        else if(transaction.nonce !== orgAlice.getNonce()+1){
            transaction.errorCode = "0001";
            transaction.errorMessage += "Nonce does not match Id\n";
            status = false;
        }
        if (status === false) {
            const errorMessage = new BpiMessage("ER1", "INFO", transaction.to, transaction.from, transaction.workflowId, transaction.workstepId,[transaction.errorCode,transaction.errorMessage]);
            return errorMessage;
        }
        else return undefined;
    }

    pushTransaction(transaction: Transaction): BpiMessage {
        //order based on trxnID
        //if nonce does not match order the transactions based on nonce
        const errorMessage = this.validateTransaction(transaction);
        if (errorMessage === undefined) {
            this.transactions.push(transaction);
            this.orderTransactions();
            return undefined;
        }
        else{
            return errorMessage;
        }
    }

    orderTransactions(){
        this.transactions.sort((a, b) => (a.transactionId > b.transactionId) ? 1 : -1);
        this.transactions.sort((a, b) => (a.nonce > b.nonce) ? 1 : -1);
    }
}