import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiSubjectDto } from '../../api/dtos/response/bpiSubject.dto';
import { BpiSubjectStorageAgent } from '../../agents/bpiSubjectsStorage.agent';
import { GetBpiSubjectByIdQuery } from './getBpiSubjectById.query';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
import { PrismaMapper as Mapper } from '../../../../../shared/prisma/prisma.mapper';
import { BpiSubject } from '../../models/bpiSubject';

@QueryHandler(GetBpiSubjectByIdQuery)
export class GetBpiSubjectByIdQueryHandler
  implements IQueryHandler<GetBpiSubjectByIdQuery>
{
  constructor(
    private readonly mapper: Mapper,
    private readonly storageAgent: BpiSubjectStorageAgent,
  ) {}

  async execute(query: GetBpiSubjectByIdQuery) {
    const bpiSubject = await this.storageAgent.getBpiSubjectById(query.id);

    if (!bpiSubject) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(bpiSubject, BpiSubject);
  }
}
