import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WorkstepDto } from '../../api/dtos/response/workstep.dto';
import { WorkstepStorageAgent } from '../../agents/workstepsStorage.agent';
import { GetWorkstepByIdQuery } from './getWorkstepById.query';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
import { Workstep } from '../../models/workstep';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@QueryHandler(GetWorkstepByIdQuery)
export class GetWorkstepByIdQueryHandler
  implements IQueryHandler<GetWorkstepByIdQuery>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly storageAgent: WorkstepStorageAgent,
  ) {}

  async execute(query: GetWorkstepByIdQuery) {
    const workstep = await this.storageAgent.getWorkstepById(query.id);

    if (!workstep) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(workstep, Workstep, WorkstepDto) as WorkstepDto;
  }
}
