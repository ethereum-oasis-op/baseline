import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiSubjectAccountDto } from 'src/bri/identity/bpiSubjectAccounts/api/dtos/response/bpiSubjectAccount.dto';
import { BpiAccountStorageAgent } from '../../agents/bpiAccountsStorage.agent';
import { BpiAccountDto } from '../../api/dtos/response/bpiAccount.dto';
import { BpiAccount } from '../../models/bpiAccount';
import { GetAllBpiAccountsQuery } from './getAllBpiAccounts.query';

@QueryHandler(GetAllBpiAccountsQuery)
export class GetAllBpiAccountsQueryHandler
  implements IQueryHandler<GetAllBpiAccountsQuery>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly storageAgent: BpiAccountStorageAgent,
  ) {}

  async execute() {
    const bpiAccounts = await this.storageAgent.getAllBpiAccounts();

    return bpiAccounts.map((bp) => {
      return this.mapper.map(bp, BpiAccount, BpiAccountDto);
    });
  }
}
