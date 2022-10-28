import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '..//api/err.messages';
import { Transaction } from '../models/transaction';

@Injectable()
export class TransactionStorageAgent extends PrismaService {
  constructor(@InjectMapper() private autoMapper: Mapper) {
    super();
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const transactionModels = await this.transaction.findMany({
      include: { FromBpiAccount: true, ToBpiAccount: true },
    });
    return transactionModels.map((transactionModel) => {
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
    });
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const transactionModel = await this.transaction.findUnique({
      where: { id },
      include: { FromBpiAccount: true, ToBpiAccount: true },
    });

    if (!transactionModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.autoMapper.map(transactionModel, Transaction, Transaction);
  }

  async createNewTransaction(transaction: Transaction): Promise<Transaction> {
    const newTransactionModel = await this.transaction.create({
      data: {
        id: transaction.id,
        nonce: transaction.nonce,
        workflowInstanceId: transaction.workflowInstanceId,
        workstepInstanceId: transaction.workstepInstanceId,
        fromBpiAccountId: transaction.FromBpiAccount.id,
        toBpiAccountId: transaction.ToBpiAccount.id,
        payload: transaction.payload,
        signature: transaction.signature,
        status: transaction.status,
      },
    });

    return this.autoMapper.map(newTransactionModel, Transaction, Transaction);
  }

  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    const updatedTransactionModel = await this.transaction.update({
      where: { id: transaction.id },
      data: {
        payload: transaction.payload,
        signature: transaction.signature,
      },
    });

    return this.autoMapper.map(
      updatedTransactionModel,
      Transaction,
      Transaction,
    );
  }

  async deleteTransaction(transaction: Transaction): Promise<void> {
    await this.transaction.delete({
      where: { id: transaction.id },
    });
  }
}
