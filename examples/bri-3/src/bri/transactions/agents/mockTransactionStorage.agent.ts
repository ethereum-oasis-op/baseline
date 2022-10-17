import { Injectable, NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Transaction } from '../models/transaction';

@Injectable()
export class MockTransactionStorageAgent {
  private transactionsStore: Transaction[] = [];

  async getTransactionById(id: string): Promise<Transaction> {
    const transaction = this.transactionsStore.find((bp) => bp.id === id);
    if (!transaction) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return transaction;
  }

  async createNewTransaction(transaction: Transaction): Promise<Transaction> {
    const createdBp = new Transaction(
      transaction.id,
      transaction.nonce,
      transaction.workflowInstanceId,
      transaction.workstepInstanceId,
      null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
      null, // TODO: transactionModel.to once BpiAccount in the prisma schema,
      transaction.payload,
      transaction.signature,
      transaction.status,
    );

    this.transactionsStore.push(createdBp);

    return Promise.resolve(createdBp);
  }

  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    const txToUpdate = this.transactionsStore.find(
      (bp) => bp.id === transaction.id,
    );
    Object.assign(txToUpdate, transaction);
    return Promise.resolve(txToUpdate);
  }

  async deleteTransaction(transaction: Transaction): Promise<void> {
    const txToDeleteIndex = this.transactionsStore.findIndex(
      (bp) => bp.id === transaction.id,
    );
    this.transactionsStore.splice(txToDeleteIndex, 1);
  }
}
