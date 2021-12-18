import { BpiMessage } from "../../bpiMessage";
import { Transaction } from "../../transaction";

export interface ITransactionPoolComponent {
    convertMessageToTransaction(message: BpiMessage): Transaction;
    validateTransaction(transaction: Transaction): BpiMessage;
    pushTransaction(transaction: Transaction): BpiMessage;
}