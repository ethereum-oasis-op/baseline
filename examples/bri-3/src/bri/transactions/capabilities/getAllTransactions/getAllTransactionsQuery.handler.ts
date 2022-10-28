import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionDto } from '../../api/dtos/response/transaction.dto';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { GetAllTransactionsQuery } from './getAllTransactions.query';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Transaction } from '../../models/transaction';

@QueryHandler(GetAllTransactionsQuery)
export class GetAllTransactionsQueryHandler
  implements IQueryHandler<GetAllTransactionsQuery>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly storageAgent: TransactionStorageAgent,
  ) {}

  async execute() {
    const transactions = await this.storageAgent.getAllTransactions();
    return transactions.map((transaction) => {
      return this.mapper.map(transaction, Transaction, TransactionDto);
    });
  }
}
