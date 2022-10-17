import { Injectable, NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Transaction } from '../models/transaction';
import Mapper from '../../utils/mapper';
import { getType } from 'tst-reflect';

@Injectable()
export class MockTransactionStorageAgent {
  constructor(private readonly mapper: Mapper) {}

  private transactionsStore: Transaction[] = [];

  async getTransactionById(id: string): Promise<Transaction> {
    const transaction = this.transactionsStore.find((bp) => bp.id === id);
    if (!transaction) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.map(transaction, getType<Transaction>()) as Transaction;
  }

  async createNewTransaction(transaction: Transaction): Promise<Transaction> {
    const createdBp = this.mapper.map(
      new Transaction(
        transaction.id,
        transaction.nonce,
        transaction.workflowInstanceId,
        transaction.workstepInstanceId,
        null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
        null, // TODO: transactionModel.to once BpiAccount in the prisma schema,
        transaction.payload,
        transaction.signature,
        transaction.status,
      ),
      getType<Transaction>(),
    ) as Transaction;

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
