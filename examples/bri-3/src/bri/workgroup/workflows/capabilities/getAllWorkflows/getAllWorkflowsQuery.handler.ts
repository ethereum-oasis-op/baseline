import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WorkflowDto } from '../../api/dtos/response/workflow.dto';
import { GetAllWorkflowsQuery } from './getAllWorkflows.query';

@QueryHandler(GetAllWorkflowsQuery)
export class GetAllWorkflowsQueryHandler
  implements IQueryHandler<GetAllWorkflowsQuery>
{
  constructor(private readonly storageAgent: WorkflowStorageAgent) {}

  async execute() {
    const workflows = await this.storageAgent.getAllWorkflows();

    return workflows.map((w) => {
      return {
        id: w.id,
        name: w.name,
        worksteps: w.workteps,
        workgroupId: w.workgroupId,
      } as WorkflowDto;
    });
  }
}
