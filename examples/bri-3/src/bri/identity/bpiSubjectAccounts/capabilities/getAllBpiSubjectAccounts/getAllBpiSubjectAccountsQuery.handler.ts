import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllBpiSubjectAccountsQuery } from './getAllBpiSubjectAccounts.query';
import { BpiSubjectAccountStorageAgent } from '../../agents/bpiSubjectAccountsStorage.agent';
import { BpiSubjectAccountDto } from '../../api/dtos/response/bpiSubjectAccount.dto';

@QueryHandler(GetAllBpiSubjectAccountsQuery)
export class GetAllBpiSubjectAccountsQueryHandler
  implements IQueryHandler<GetAllBpiSubjectAccountsQuery>
{
  constructor(private readonly storageAgent: BpiSubjectAccountStorageAgent) {}

  async execute() {
    const bpiSubjectAccounts =
      await this.storageAgent.getAllBpiSubjectAccounts();

    return bpiSubjectAccounts.map((bp) => {
      return {
        id: bp.id,
        creatorBpiSubject: {
          id: bp.creatorBpiSubject.id,
          name: bp.creatorBpiSubject.name,
          desc: bp.creatorBpiSubject.description,
          publicKey: bp.creatorBpiSubject.publicKey,
        },
        ownerBpiSubject: {
          id: bp.ownerBpiSubject.id,
          name: bp.ownerBpiSubject.name,
          desc: bp.ownerBpiSubject.description,
          publicKey: bp.ownerBpiSubject.publicKey,
        },
      } as BpiSubjectAccountDto;
    });
  }
}
