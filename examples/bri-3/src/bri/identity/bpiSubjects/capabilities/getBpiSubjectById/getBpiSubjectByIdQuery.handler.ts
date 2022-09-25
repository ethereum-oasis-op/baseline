import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiSubjectDto } from '../../api/dtos/response/bpiSubject.dto';
import { BpiSubjectStorageAgent } from '../../agents/bpiSubjectsStorage.agent';
import { GetBpiSubjectByIdQuery } from './getBpiSubjectById.query';
import { getType} from "tst-reflect";
import Mapper from '../../../../utils/mapper';

@QueryHandler(GetBpiSubjectByIdQuery)
export class GetBpiSubjectByIdQueryHandler implements IQueryHandler<GetBpiSubjectByIdQuery>
{
  constructor(private readonly storageAgent: BpiSubjectStorageAgent) {}

  async execute(query: GetBpiSubjectByIdQuery) {
    const bpiSubject = await this.storageAgent.getBpiSubjectById(query.id);
    return Mapper.map(bpiSubject, getType<BpiSubjectDto>()) as BpiSubjectDto;
  }
}
