import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiSubjectDto } from '../../api/dtos/response/bpiSubject.dto';
import { BpiSubjectStorageAgent } from '../../agents/bpiSubjectsStorage.agent';
import { GetAllBpiSubjectsQuery } from './getAllBpiSubjects.query';
import { getType } from 'tst-reflect';
import Mapper from '../../../../utils/mapper';

@QueryHandler(GetAllBpiSubjectsQuery)
export class GetAllBpiSubjectsQueryHandler
  implements IQueryHandler<GetAllBpiSubjectsQuery>
{
  constructor(private readonly storageAgent: BpiSubjectStorageAgent) {}

  async execute() {
    const bpiSubjects = await this.storageAgent.getAllBpiSubjects();
    return bpiSubjects.map((bp) => {
      return Mapper.map(bp, getType<BpiSubjectDto>()) as BpiSubjectDto;
    });
  }
}
