import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '..//api/err.messages';
import { Transaction } from '../models/transaction';

@Injectable()
export class TransactionStorageAgent extends PrismaService {
  async getTransactionById(id: string): Promise<Transaction> {
    const transactionModel = await this.transaction.findUnique({
      where: { transactionId: id },
    });

    if (!transactionModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return new Transaction(
      transactionModel.transactionId,
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
        t.transactionId,
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
        transactionId: transaction.transactionId,
        nonce: transaction.nonce,
        workflowInstanceId: transaction.workflowInstanceId,
        workstepInstanceId: transaction.workstepInstanceId,
        from: null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
        to: null, // TODO: transactionModel.to once BpiAccount in the prisma schema,
        payload: transaction.payload,
        signature: transaction.signature,
        status: transaction.status,
      },
    });

    return new Transaction(
      newTransactionModel.transactionId,
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
      where: { transactionId: transaction.transactionId },
      data: {
        nonce: transaction.nonce,
        workflowInstanceId: transaction.workflowInstanceId,
        workstepInstanceId: transaction.workstepInstanceId,
        from: null, // TODO: newTransactionModel.from once BpiAccount in the prisma schema,
        to: null, // TODO: newTransactionModel.to once BpiAccount in the prisma schema,
        payload: transaction.payload,
        signature: transaction.signature,
        status: transaction.status,
      },
    });

    return new Transaction(
      newTransactionModel.transactionId,
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
      where: { transactionId: transaction.transactionId },
    });
  }
}
