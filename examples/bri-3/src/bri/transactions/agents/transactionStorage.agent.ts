import { Injectable, NotFoundException } from '@nestjs/common';
import Mapper from '../../utils/mapper';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '..//api/err.messages';
import { Transaction } from '../models/transaction';
import { getType } from 'tst-reflect';

@Injectable()
export class TransactionStorageAgent extends PrismaService {
  constructor(private readonly mapper: Mapper) {
    super();
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const transactionModels = await this.transaction.findMany();
    return transactionModels.map((transactionModel) => {
      return this.mapper.map(transactionModel, getType<Transaction>(), {
        opts: {
          from: null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
          to: null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
        },
      }) as Transaction;
    });
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const transactionModel = await this.transaction.findUnique({
      where: { id },
    });

    if (!transactionModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(transactionModel, getType<Transaction>(), {
      opts: {
        from: null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
        to: null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
      },
    }) as Transaction;
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

    return this.mapper.map(newTransactionModel, getType<Transaction>(), {
      opts: {
        from: null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
        to: null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
      },
    }) as Transaction;
  }

  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    const newTransactionModel = await this.transaction.update({
      where: { id: transaction.id },
      data: {
        payload: transaction.payload,
        signature: transaction.signature,
      },
    });

    return this.mapper.map(newTransactionModel, getType<Transaction>(), {
      opts: {
        from: null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
        to: null, // TODO: transactionModel.from once BpiAccount in the prisma schema,
      },
    }) as Transaction;
  }

  async deleteTransaction(transaction: Transaction): Promise<void> {
    await this.transaction.delete({
      where: { id: transaction.id },
    });
  }
}
