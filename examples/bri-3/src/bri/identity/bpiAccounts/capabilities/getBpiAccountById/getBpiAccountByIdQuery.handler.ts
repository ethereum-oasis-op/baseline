import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiSubjectAccountDto } from '../../../bpiSubjectAccounts/api/dtos/response/bpiSubjectAccount.dto';
import { BpiSubject } from '../../../bpiSubjects/models/bpiSubject';
import { BpiAccountStorageAgent } from '../../agents/bpiAccountsStorage.agent';
import { BpiAccountDto } from '../../api/dtos/response/bpiAccount.dto';
import { BpiAccount } from '../../models/bpiAccount';
import { GetBpiAccountByIdQuery } from './getBpiAccountById.query';

@QueryHandler(GetBpiAccountByIdQuery)
export class GetBpiAccountByIdQueryHandler
  implements IQueryHandler<GetBpiAccountByIdQuery>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly storageAgent: BpiAccountStorageAgent,
  ) {}

  async execute(query: GetBpiAccountByIdQuery) {
    const bpiAccount = await this.storageAgent.getAccountById(query.id);

    return this.mapper.map(bpiAccount, BpiAccount, BpiAccountDto);
  }
}
