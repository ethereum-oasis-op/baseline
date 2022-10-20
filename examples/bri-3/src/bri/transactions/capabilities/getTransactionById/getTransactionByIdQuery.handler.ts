import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionDto } from '../../api/dtos/response/transaction.dto';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { GetTransactionByIdQuery } from './getTransactionById.query';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Transaction } from '../../models/transaction';

@QueryHandler(GetTransactionByIdQuery)
export class GetTransactionByIdQueryHandler
  implements IQueryHandler<GetTransactionByIdQuery>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly storageAgent: TransactionStorageAgent,
  ) {}

  async execute(query: GetTransactionByIdQuery) {
    const transaction = await this.storageAgent.getTransactionById(query.id);

    if (!transaction) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(transaction, Transaction, TransactionDto);
  }
}
