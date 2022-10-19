import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
import { GetBpiSubjectAccountByIdQuery } from './getBpiSubjectAccountById.query';
import { BpiSubjectAccountStorageAgent } from '../../agents/bpiSubjectAccountsStorage.agent';
import { BpiSubjectAccountDto } from '../../api/dtos/response/bpiSubjectAccount.dto';

@QueryHandler(GetBpiSubjectAccountByIdQuery)
export class GetBpiSubjectAccountByIdQueryHandler
  implements IQueryHandler<GetBpiSubjectAccountByIdQuery>
{
  constructor(private readonly storageAgent: BpiSubjectAccountStorageAgent) {}

  async execute(query: GetBpiSubjectAccountByIdQuery) {
    const bpiSubjectAccount = await this.storageAgent.getBpiSubjectAccountById(
      query.id,
    );

    if (!bpiSubjectAccount) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return {
      // TODO: Write generic mapper domainObject -> DTO
      id: bpiSubjectAccount.id,
      creatorBpiSubject: {
        id: bpiSubjectAccount.creatorBpiSubject.id,
        name: bpiSubjectAccount.creatorBpiSubject.name,
        desc: bpiSubjectAccount.creatorBpiSubject.description,
        publicKey: bpiSubjectAccount.creatorBpiSubject.publicKey,
      },
      ownerBpiSubject: {
        id: bpiSubjectAccount.ownerBpiSubject.id,
        name: bpiSubjectAccount.ownerBpiSubject.name,
        desc: bpiSubjectAccount.ownerBpiSubject.description,
        publicKey: bpiSubjectAccount.ownerBpiSubject.publicKey,
      },
      // TODO: automapper fix
    } as unknown as BpiSubjectAccountDto;
  }
}
