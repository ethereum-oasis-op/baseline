import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaMapper } from '../../../shared/prisma/prisma.mapper';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '..//api/err.messages';
import { Transaction } from '../models/transaction';
import { TransactionStatus } from '../models/transactionStatus.enum';

@Injectable()
export class TransactionStorageAgent {
  constructor(
    private readonly mapper: PrismaMapper,
    private readonly prisma: PrismaService,
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    const transactionModels = await this.prisma.transaction.findMany({
      include: { fromBpiSubjectAccount: true, toBpiSubjectAccount: true },
    });
    return transactionModels.map((transactionModel) => {
      return this.mapper.map(transactionModel, Transaction);
    });
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const transactionModel = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        fromBpiSubjectAccount: {
          include: {
            ownerBpiSubject: {
              include: {
                publicKeys: true,
              },
            },
            creatorBpiSubject: true,
          },
        },
        toBpiSubjectAccount: {
          include: {
            ownerBpiSubject: {
              include: {
                publicKeys: true,
              },
            },
            creatorBpiSubject: true,
          },
        },
      },
    });

    if (!transactionModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(transactionModel, Transaction);
  }

  async getTopNTransactionsByStatus(
    n: number,
    statusToFetch: TransactionStatus,
  ): Promise<Transaction[]> {
    // TODO: #745 Add creation date to transaction
    // TODO: #745 Add execution or abortion date to transaction
    const transactionModels = await this.prisma.transaction.findMany({
      include: {
        fromBpiSubjectAccount: {
          include: {
            ownerBpiSubject: {
              include: {
                publicKeys: true,
              },
            },
          },
        },
        toBpiSubjectAccount: {
          include: {
            ownerBpiSubject: {
              include: {
                publicKeys: true,
              },
            },
          },
        },
      },
      where: { status: statusToFetch },
      take: n,
    });

    return transactionModels.map((transactionModel) => {
      return this.mapper.map(transactionModel, Transaction);
    });
  }

  async storeNewTransaction(transaction: Transaction): Promise<Transaction> {
    const newTransactionModel = await this.prisma.transaction.create({
      data: {
        id: transaction.id,
        nonce: transaction.nonce,
        workflowId: transaction.workflowId,
        workstepId: transaction.workstepId,
        fromBpiSubjectAccountId: transaction.fromBpiSubjectAccountId,
        toBpiSubjectAccountId: transaction.toBpiSubjectAccountId,
        payload: transaction.payload,
        signature: transaction.signature,
        status: transaction.status,
      },
      include: {
        fromBpiSubjectAccount: {
          include: {
            ownerBpiSubject: {
              include: {
                publicKeys: true,
              },
            },
            creatorBpiSubject: true,
          },
        },
        toBpiSubjectAccount: {
          include: {
            ownerBpiSubject: {
              include: {
                publicKeys: true,
              },
            },
            creatorBpiSubject: true,
          },
        },
      },
    });

    return this.mapper.map(newTransactionModel, Transaction);
  }

  async updateTransactionPayload(
    transaction: Transaction,
  ): Promise<Transaction> {
    const updatedTransactionModel = await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        payload: transaction.payload,
        signature: transaction.signature,
      },
    });

    return this.mapper.map(updatedTransactionModel, Transaction);
  }

  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    const updatedTransaction = await this.prisma.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        status: transaction.status,
        workflowInstanceId: transaction.workflowInstanceId,
        workstepInstanceId: transaction.workstepInstanceId,
      },
    });

    return this.mapper.map(updatedTransaction, Transaction);
  }

  async deleteTransaction(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id: transaction.id },
    });
  }
}
