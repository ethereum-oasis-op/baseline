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

    //this.autoMapper.map(transactionModel, Transaction, Transaction);

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

  async createNewTransaction(transaction: Transaction): Promise<Transaction> {
    const newTransactionModel = await this.transaction.create({
      data: {
        id: transaction.id,
        nonce: transaction.nonce,
        workflowInstanceId: transaction.workflowInstanceId,
        workstepInstanceId: transaction.workstepInstanceId,
        fromBpiAccountId: transaction.from.id,
        toBpiAccountId: transaction.to.id,
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
