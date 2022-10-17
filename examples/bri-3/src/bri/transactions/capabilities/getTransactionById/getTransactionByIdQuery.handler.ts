import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionDto } from '../../api/dtos/response/transaction.dto';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { GetTransactionByIdQuery } from './getTransactionById.query';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
import Mapper from '../../../utils/mapper';
import { getType } from 'tst-reflect';

@QueryHandler(GetTransactionByIdQuery)
export class GetTransactionByIdQueryHandler
  implements IQueryHandler<GetTransactionByIdQuery>
{
  constructor(
    private readonly storageAgent: TransactionStorageAgent,
    private readonly mapper: Mapper,
  ) {}

  async execute(query: GetTransactionByIdQuery) {
    const transaction = await this.storageAgent.getTransactionById(query.id);

    if (!transaction) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(transaction, getType<TransactionDto>(), {
      opts: {
        from: '', // TODO: transaction.from once BpiAccount in the prisma schema,
        to: '', // TODO: transaction.from once BpiAccount in the prisma schema,
      },
    }) as TransactionDto;
  }
}
