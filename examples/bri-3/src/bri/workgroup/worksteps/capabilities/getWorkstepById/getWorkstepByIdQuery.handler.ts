import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WorkstepDto } from '../../api/dtos/response/workstep.dto';
import { WorkstepStorageAgent } from '../../persistence/workstepsStorage.agent';
import { GetWorkstepByIdQuery } from './getWorkstepById.query';
import { NOT_FOUND_ERR_MESSAGE } from "../../api/err.messages";


@QueryHandler(GetWorkstepByIdQuery)
export class GetWorkstepByIdQueryHandler implements IQueryHandler<GetWorkstepByIdQuery> {
  constructor(
    private readonly storageAgent: WorkstepStorageAgent
    ) {}

  async execute(query: GetWorkstepByIdQuery) {
    const workstep = await this.storageAgent.getWorkstepById(query.id);

    if (!workstep) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return { // TODO: Write generic mapper domainObject -> DTO
      id: workstep.id,
      name: workstep.name,
      version: workstep.version,
      status: workstep.status,
      workgroupId: workstep.workgroupId,
      securityPolicy: workstep.securityPolicy,
      privacyPolicy: workstep.privacyPolicy
    } as WorkstepDto;
  }
}
