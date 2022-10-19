import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiSubjectAccountDto } from 'src/bri/identity/bpiSubjectAccounts/api/dtos/response/bpiSubjectAccount.dto';
import { BpiAccountStorageAgent } from '../../agents/bpiAccountsStorage.agent';
import { BpiAccountDto } from '../../api/dtos/response/bpiAccount.dto';
import { GetAllBpiAccountsQuery } from './getAllBpiAccounts.query';

@QueryHandler(GetAllBpiAccountsQuery)
export class GetAllBpiAccountsQueryHandler
  implements IQueryHandler<GetAllBpiAccountsQuery>
{
  constructor(private readonly storageAgent: BpiAccountStorageAgent) {}

  async execute() {
    const bpiAccounts = await this.storageAgent.getAllBpiAccounts();

    return bpiAccounts.map((bp) => {
      return {
        id: bp.id,
        nonce: bp.nonce,
        ownerBpiSubjectAccounts: bp.ownerBpiSubjectAccounts.map((a) => {
          return {
            id: a.id,
            creatorBpiSubject: {
              id: a.creatorBpiSubject.id,
              name: a.creatorBpiSubject.name,
              desc: a.creatorBpiSubject.description,
              publicKey: a.creatorBpiSubject.publicKey,
            },
            ownerBpiSubject: {
              id: a.ownerBpiSubject.id,
              name: a.ownerBpiSubject.name,
              desc: a.ownerBpiSubject.description,
              publicKey: a.ownerBpiSubject.publicKey,
            },
            // TODO: automapper fix
          } as unknown as BpiSubjectAccountDto;
        }),
      } as BpiAccountDto;
    });
  }
}
