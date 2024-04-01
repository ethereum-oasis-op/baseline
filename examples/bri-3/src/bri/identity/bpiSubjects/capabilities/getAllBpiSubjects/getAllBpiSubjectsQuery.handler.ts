import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiSubjectStorageAgent } from '../../agents/bpiSubjectsStorage.agent';
import { GetAllBpiSubjectsQuery } from './getAllBpiSubjects.query';
import { BpiSubject } from '../../models/bpiSubject';
import { PrismaMapper as Mapper } from '../../../../../shared/prisma/prisma.mapper';

@QueryHandler(GetAllBpiSubjectsQuery)
export class GetAllBpiSubjectsQueryHandler
  implements IQueryHandler<GetAllBpiSubjectsQuery>
{
  constructor(
    private readonly mapper: Mapper,
    private readonly storageAgent: BpiSubjectStorageAgent,
  ) {}

  async execute() {
    const bpiSubjects = await this.storageAgent.getAllBpiSubjects();
    return bpiSubjects.map((bp) => {
      return this.mapper.map(bp, BpiSubject);
    });
  }
}
