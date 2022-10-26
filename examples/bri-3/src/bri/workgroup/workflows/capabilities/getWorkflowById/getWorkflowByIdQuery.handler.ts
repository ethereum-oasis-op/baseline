import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetWorkstepByIdQuery } from 'src/bri/workgroup/worksteps/capabilities/getWorkstepById/getWorkstepById.query';
import { WorkflowStorageAgent } from '../../agents/workflowsStorage.agent';
import { WorkflowDto } from '../../api/dtos/response/workflow.dto';
import { Workflow } from '../../models/workflow';
import { GetWorkflowByIdQuery } from './getWorkflowById.query';

@QueryHandler(GetWorkflowByIdQuery)
export class GetWorkflowByIdQueryHandler
  implements IQueryHandler<GetWorkflowByIdQuery>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly storageAgent: WorkflowStorageAgent,
  ) {}

  async execute(query: GetWorkstepByIdQuery) {
    const workflow = await this.storageAgent.getWorkflowById(query.id);
    return this.mapper.map(workflow, Workflow, WorkflowDto) as WorkflowDto;
  }
}
