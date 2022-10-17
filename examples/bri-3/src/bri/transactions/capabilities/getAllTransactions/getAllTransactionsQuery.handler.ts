import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionDto } from '../../api/dtos/response/transaction.dto';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { GetAllTransactionsQuery } from './getAllTransactions.query';
import { getType } from 'tst-reflect';
import Mapper from '../../../utils/mapper';

@QueryHandler(GetAllTransactionsQuery)
export class GetAllTransactionsQueryHandler
  implements IQueryHandler<GetAllTransactionsQuery>
{
  constructor(
    private readonly storageAgent: TransactionStorageAgent,
    private readonly mapper: Mapper,
  ) {}

  async execute() {
    const transactions = await this.storageAgent.getAllTransactions();
    return transactions.map((transaction) => {
      return this.mapper.map(transaction, getType<TransactionDto>(), {
        opts: {
          from: '', // TODO: transaction.from once BpiAccount in the prisma schema,
          to: '', // TODO: transaction.from once BpiAccount in the prisma schema,
        },
      }) as TransactionDto;
    });
  }
}
