import { BpiMessage } from "./bpiMessage";
import { BpiSubject } from "./bpiSubject";
import { Transaction } from "./transaction";

export class TransactionPool{

    organisations: BpiSubject[];
    transactions: Transaction[];


    isTransactionValid(transaction:Transaction):[boolean,BpiMessage]{
        let status: boolean = true;

        //R[262]
        //Todo: nonce??
        //Todo: verify owners signature in transaction
        if( transaction.workflowId === ""){
            transaction.errorCode="0001";
            transaction.errorMessage+="Invalid workflow Id\n";
            status= false;
        }
        else if(transaction.workstepId === "" ){
            transaction.errorCode="0001";
            transaction.errorMessage+="Invalid workstep Id\n";
            status= false;
        }
        else if(this.getOrganizationById(transaction.from.id) === undefined ){
            transaction.errorCode="0001";
            transaction.errorMessage+="Invalid sender Id\n";
            status= false;
        }
        else if(this.getOrganizationById(transaction.to.id) === undefined){
            transaction.errorCode="0001";
            transaction.errorMessage+="Invalid reciever Id\n";
            status= false;
        }
        if (status === false){
            const errorMessage= new BpiMessage("ER1","Error",transaction.to,transaction.from,"TODO",[transaction.from,transaction.errorCode,transaction.errorMessage,transaction]);
            return [status,errorMessage];
        }
        else return [status,undefined];
    }

    getOrganizationById(id: string): BpiSubject {
        const orgs = this.organisations.filter(org => org.id === id);

        return orgs[0];
    }

    pullTransaction(transaction:Transaction){
        //order based on trxnID
        //if nonce does not match order the transactions based on nonce

    }
}