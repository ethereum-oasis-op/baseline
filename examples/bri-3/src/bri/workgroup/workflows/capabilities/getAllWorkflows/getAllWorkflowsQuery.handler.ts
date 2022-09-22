import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
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
        worksteps: w.workteps,
      } as WorkflowDto;
    });
  }
}
