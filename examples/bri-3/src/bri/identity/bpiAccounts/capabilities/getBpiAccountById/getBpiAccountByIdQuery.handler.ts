import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiSubjectAccountDto } from 'src/bri/identity/bpiSubjectAccounts/api/dtos/response/bpiSubjectAccount.dto';
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
      ownerBpiSubjectAccounts: bpiAccount.ownerBpiSubjectAccounts.map((a) => {
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
        } as BpiSubjectAccountDto;
      }),
    } as BpiAccountDto;
  }
}
