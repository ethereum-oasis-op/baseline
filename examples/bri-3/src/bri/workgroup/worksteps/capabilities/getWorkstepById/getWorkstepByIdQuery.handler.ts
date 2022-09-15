import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WorkstepDto } from '../../api/dtos/response/workstep.dto';
import { WorkstepRepository } from '../../persistence/worksteps.repository';
import { GetWorkstepByIdQuery } from './getWorkstepById.query';

@QueryHandler(GetWorkstepByIdQuery)
export class GetWorkstepByIdQueryHandler implements IQueryHandler<GetWorkstepByIdQuery> {
  constructor(private readonly repo: WorkstepRepository) {}

  async execute(query: GetWorkstepByIdQuery) {
    const workstep = await this.repo.getWorkstepById(query.id);

    if (!workstep) {
      throw new NotFoundException(`Workstep with id: ${query.id} does not exist.`)
    }

    return { // TODO: Write generic mapper domainObject -> DTO
      id: workstep.id,
      name: workstep.name,
      version: workstep.version,
      status: workstep.status,
      workgroupId: workstep.workgroupId,
    } as WorkstepDto;
  }
}
