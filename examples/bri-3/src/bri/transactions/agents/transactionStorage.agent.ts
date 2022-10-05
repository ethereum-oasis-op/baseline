import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '..//api/err.messages';
import { Transaction } from '../models/transaction';

@Injectable()
export class TransactionStorageAgent extends PrismaService {
  async getTransactionById(id: string): Promise<Transaction> {
    const transactionModel = await this.transaction.findUnique({
      where: { id: id },
    });

    if (!transactionModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return new Transaction(
      transactionModel.id,
      transactionModel.nonce,
      transactionModel.workflowInstanceId,
      transactionModel.workstepInstanceId,
      null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
      null, // TODO: transactionModel.to once BpiAccount in the prisma schema,
      transactionModel.payload,
      transactionModel.signature,
      transactionModel.status,
    );
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const transactionModels = await this.transaction.findMany();
    return transactionModels.map((t) => {
      return new Transaction(
        t.id,
        t.nonce,
        t.workflowInstanceId,
        t.workstepInstanceId,
        null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
        null, // TODO: transactionModel.to once BpiAccount in the prisma schema,
        t.payload,
        t.signature,
        t.status,
      );
    });
  }

  async createNewTransaction(transaction: Transaction): Promise<Transaction> {
    const newTransactionModel = await this.transaction.create({
      data: {
        id: transaction.id,
        nonce: transaction.nonce,
        workflowInstanceId: transaction.workflowInstanceId,
        workstepInstanceId: transaction.workstepInstanceId,
        from: '', // TODO: transactionModel.from once BpiAccount in the prisma schema,
        to: '', // TODO: transactionModel.to once BpiAccount in the prisma schema,
        payload: transaction.payload,
        signature: transaction.signature,
        status: transaction.status,
      },
    });

    return new Transaction(
      newTransactionModel.id,
      newTransactionModel.nonce,
      newTransactionModel.workflowInstanceId,
      newTransactionModel.workstepInstanceId,
      null, // TODO: newTransactionModel.from once BpiAccount in the prisma schema,
      null, // TODO: newTransactionModel.to once BpiAccount in the prisma schema,
      newTransactionModel.payload,
      newTransactionModel.signature,
      newTransactionModel.status,
    );
  }

  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    const newTransactionModel = await this.transaction.update({
      where: { id: transaction.id },
      data: {
        payload: transaction.payload,
        signature: transaction.signature,
      },
    });

    return new Transaction(
      newTransactionModel.id,
      newTransactionModel.nonce,
      newTransactionModel.workflowInstanceId,
      newTransactionModel.workstepInstanceId,
      null, // TODO: newTransactionModel.from once BpiAccount in the prisma schema,
      null, // TODO: newTransactionModel.to once BpiAccount in the prisma schema,
      newTransactionModel.payload,
      newTransactionModel.signature,
      newTransactionModel.status,
    );
  }

  async deleteTransaction(transaction: Transaction): Promise<void> {
    await this.transaction.delete({
      where: { id: transaction.id },
    });
  }
}
