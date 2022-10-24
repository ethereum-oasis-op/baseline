import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiSubjectAccountDto } from '../../../bpiSubjectAccounts/api/dtos/response/bpiSubjectAccount.dto';
import { BpiSubject } from '../../../bpiSubjects/models/bpiSubject';
import { BpiAccountStorageAgent } from '../../agents/bpiAccountsStorage.agent';
import { BpiAccountDto } from '../../api/dtos/response/bpiAccount.dto';
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

    return {
      id: bpiAccount.id,
      nonce: bpiAccount.nonce,
      ownerBpiSubjectAccounts: bpiAccount.ownerBpiSubjectAccounts.map((a) => {
        return {
          id: a.id,
          creatorBpiSubject: this.mapper.map(
            a.creatorBpiSubject,
            BpiSubject,
            BpiSubject,
          ),
          ownerBpiSubject: this.mapper.map(
            a.ownerBpiSubject,
            BpiSubject,
            BpiSubject,
          ),
        } as BpiSubjectAccountDto;
      }),
    } as BpiAccountDto;
  }
}
