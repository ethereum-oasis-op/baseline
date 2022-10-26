import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WorkstepDto } from '../../api/dtos/response/workstep.dto';
import { WorkstepStorageAgent } from '../../agents/workstepsStorage.agent';
import { GetAllWorkstepsQuery } from './getAllWorksteps.query';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Workstep } from '../../models/workstep';

@QueryHandler(GetAllWorkstepsQuery)
export class GetAllWorkstepsQueryHandler
  implements IQueryHandler<GetAllWorkstepsQuery>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly storageAgent: WorkstepStorageAgent,
  ) {}

  async execute() {
    const worksteps = await this.storageAgent.getAllWorksteps();

    return worksteps.map((w) => {
      return this.mapper.map(w, Workstep, WorkstepDto) as WorkstepDto;
    });
  }
}
