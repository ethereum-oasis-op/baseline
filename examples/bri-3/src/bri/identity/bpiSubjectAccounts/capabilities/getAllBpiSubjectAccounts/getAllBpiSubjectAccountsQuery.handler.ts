import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllBpiSubjectAccountsQuery } from './getAllBpiSubjectAccounts.query';
import { BpiSubjectAccountStorageAgent } from '../../agents/bpiSubjectAccountsStorage.agent';
import { BpiSubjectAccountDto } from '../../api/dtos/response/bpiSubjectAccount.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { BpiSubjectAccount } from '../../models/bpiSubjectAccount';

@QueryHandler(GetAllBpiSubjectAccountsQuery)
export class GetAllBpiSubjectAccountsQueryHandler
  implements IQueryHandler<GetAllBpiSubjectAccountsQuery>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly storageAgent: BpiSubjectAccountStorageAgent,
  ) {}

  async execute() {
    const bpiSubjectAccounts =
      await this.storageAgent.getAllBpiSubjectAccounts();

    return bpiSubjectAccounts.map((bp) => {
      return this.mapper.map(bp, BpiSubjectAccount, BpiSubjectAccountDto);
    });
  }
}
