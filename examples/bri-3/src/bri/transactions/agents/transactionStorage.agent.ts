import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '..//api/err.messages';
import { Transaction } from '../models/transaction';

@Injectable()
export class TransactionStorageAgent extends PrismaService {
  constructor(@InjectMapper() private mapper: Mapper) {
    super();
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const transactionModels = await this.transaction.findMany({
      include: { fromBpiSubjectAccount: true, toBpiSubjectAccount: true },
    });
    return transactionModels.map((transactionModel) => {
      return new Transaction(
        transactionModel.id,
        transactionModel.nonce,
        transactionModel.workflowInstanceId,
        transactionModel.workstepInstanceId,
        this.mapper.map(
          transactionModel.fromBpiSubjectAccount,
          BpiSubjectAccount,
          BpiSubjectAccount,
        ),
        this.mapper.map(
          transactionModel.toBpiSubjectAccount,
          BpiSubjectAccount,
          BpiSubjectAccount,
        ),
        transactionModel.payload,
        transactionModel.signature,
        transactionModel.status,
      );
    });
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const transactionModel = await this.transaction.findUnique({
      where: { id },
      include: { fromBpiSubjectAccount: true, toBpiSubjectAccount: true },
    });

    if (!transactionModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(transactionModel, Transaction, Transaction);
  }

  async createNewTransaction(transaction: Transaction): Promise<Transaction> {
    const newTransactionModel = await this.transaction.create({
      data: {
        id: transaction.id,
        nonce: transaction.nonce,
        workflowInstanceId: transaction.workflowInstanceId,
        workstepInstanceId: transaction.workstepInstanceId,
        fromBpiSubjectAccountId: transaction.fromBpiSubjectAccount.id,
        toBpiSubjectAccountId: transaction.toBpiSubjectAccount.id,
        payload: transaction.payload,
        signature: transaction.signature,
        status: transaction.status,
      },
    });

    return this.mapper.map(newTransactionModel, Transaction, Transaction);
  }

  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    const updatedTransactionModel = await this.transaction.update({
      where: { id: transaction.id },
      data: {
        payload: transaction.payload,
        signature: transaction.signature,
      },
    });

    return this.mapper.map(updatedTransactionModel, Transaction, Transaction);
  }

  async deleteTransaction(transaction: Transaction): Promise<void> {
    await this.transaction.delete({
      where: { id: transaction.id },
    });
  }
}
