import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WorkflowStorageAgent } from '../../agents/workflowsStorage.agent';
import { WorkflowDto } from '../../api/dtos/response/workflow.dto';
import { Workflow } from '../../models/workflow';
import { GetAllWorkflowsQuery } from './getAllWorkflows.query';

@QueryHandler(GetAllWorkflowsQuery)
export class GetAllWorkflowsQueryHandler
  implements IQueryHandler<GetAllWorkflowsQuery>
{
  constructor(
    @InjectMapper() private mapper: Mapper,
    private readonly storageAgent: WorkflowStorageAgent,
  ) {}

  async execute() {
    const workflows = await this.storageAgent.getAllWorkflows();

    return workflows.map((w) => {
      return this.mapper.map(w, Workflow, WorkflowDto);
    });
  }
}
