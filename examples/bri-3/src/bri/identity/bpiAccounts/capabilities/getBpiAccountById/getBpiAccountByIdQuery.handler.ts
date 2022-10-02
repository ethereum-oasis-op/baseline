import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiAccountStorageAgent } from '../../agents/bpiAccountsStorage.agent';
import { BpiAccountDto } from '../../api/dtos/response/bpiAccount.dto';
import { GetBpiAccountByIdQuery } from './getBpiAccountById.query';

@QueryHandler(GetBpiAccountByIdQuery)
export class GetBpiAccountByIdQueryHandler
  implements IQueryHandler<GetBpiAccountByIdQuery>
{
  constructor(private readonly storageAgent: BpiAccountStorageAgent) {}

  async execute(query: GetBpiAccountByIdQuery) {
    const bpiSubject = await this.storageAgent.getAccountById(query.id);

    return {
      id: bpiSubject.id,
      nonce: bpiSubject.nonce,
      ownerBpiSubjectIds: bpiSubject.ownerBpiSubjectIds,
    } as BpiAccountDto;
  }
}
