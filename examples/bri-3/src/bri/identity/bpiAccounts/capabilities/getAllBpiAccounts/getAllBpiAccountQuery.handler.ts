import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiAccountStorageAgent } from '../../agents/bpiAccountsStorage.agent';
import { BpiAccountDto } from '../../api/dtos/response/bpiAccount.dto';
import { GetAllBpiAccountsQuery } from './getAllBpiAccounts.query';

@QueryHandler(GetAllBpiAccountsQuery)
export class GetAllBpiAccountsQueryHandler
  implements IQueryHandler<GetAllBpiAccountsQuery>
{
  constructor(private readonly storageAgent: BpiAccountStorageAgent) {}

  async execute() {
    const bpiSubjects = await this.storageAgent.getAllBpiAccounts();

    return bpiSubjects.map((bp) => {
      return {
        id: bp.id,
        nonce: bp.nonce,
        ownerBpiSubjectIds: bp.ownerBpiSubjectIds,
      } as BpiAccountDto;
    });
  }
}
