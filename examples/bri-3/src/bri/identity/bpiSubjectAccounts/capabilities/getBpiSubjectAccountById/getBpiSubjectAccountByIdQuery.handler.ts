import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
import { GetBpiSubjectAccountByIdQuery } from './getBpiSubjectAccountById.query';
import { BpiSubjectAccountStorageAgent } from '../../agents/bpiSubjectAccountsStorage.agent';
import { BpiSubjectAccountDto } from '../../api/dtos/response/bpiSubjectAccount.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { BpiSubjectAccount } from '../../models/bpiSubjectAccount';

@QueryHandler(GetBpiSubjectAccountByIdQuery)
export class GetBpiSubjectAccountByIdQueryHandler
  implements IQueryHandler<GetBpiSubjectAccountByIdQuery>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly storageAgent: BpiSubjectAccountStorageAgent) {}

  async execute(query: GetBpiSubjectAccountByIdQuery) {
    const bpiSubjectAccount = await this.storageAgent.getBpiSubjectAccountById(
      query.id,
    );

    if (!bpiSubjectAccount) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(bpiSubjectAccount, BpiSubjectAccount, BpiSubjectAccountDto)
  }
}
