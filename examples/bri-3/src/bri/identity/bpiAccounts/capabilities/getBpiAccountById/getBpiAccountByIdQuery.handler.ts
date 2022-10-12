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
    const bpiAccount = await this.storageAgent.getAccountById(query.id);

    return {
      id: bpiAccount.id,
      nonce: bpiAccount.nonce,
      ownerBpiSubjectIds: bpiAccount.ownerBpiSubjectIds,
    } as BpiAccountDto;
  }
}
