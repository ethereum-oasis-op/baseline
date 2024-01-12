import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiSubjectDto } from '../../api/dtos/response/bpiSubject.dto';
import { BpiSubjectStorageAgent } from '../../agents/bpiSubjectsStorage.agent';
import { GetAllBpiSubjectsQuery } from './getAllBpiSubjects.query';
import { InjectMapper } from '@automapper/nestjs';
import { BpiSubject } from '../../models/bpiSubject';
import { Mapper } from '@automapper/core';

@QueryHandler(GetAllBpiSubjectsQuery)
export class GetAllBpiSubjectsQueryHandler
  implements IQueryHandler<GetAllBpiSubjectsQuery>
{
  constructor(
    @InjectMapper() private autoMapper: Mapper,
    private readonly storageAgent: BpiSubjectStorageAgent,
  ) {}

  async execute() {
    const bpiSubjects = await this.storageAgent.getAllBpiSubjects();
    return bpiSubjects.map((bp) => {
      const target = new BpiSubjectDto();
      return Object.assign(target, bp);
    });
  }
}
