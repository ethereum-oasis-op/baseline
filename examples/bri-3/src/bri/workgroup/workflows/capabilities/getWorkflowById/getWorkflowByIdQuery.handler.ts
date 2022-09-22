import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetWorkstepByIdQuery } from 'src/bri/workgroup/worksteps/capabilities/getWorkstepById/getWorkstepById.query';
import { GetWorkflowByIdQuery } from './getWorkflowById.query';

@QueryHandler(GetWorkflowByIdQuery)
export class GetWorkflowByIdQueryHandler
  implements IQueryHandler<GetWorkflowByIdQuery>
{
  constructor(private readonly storageAgent: WorkflowStorageAgent) {}

  async execute(query: GetWorkstepByIdQuery) {
    const workflow = await this.storageAgent.getWorkflowById(query.id);

    return {
      //TODO: Write generic mapper domainObject -> DTO
      id: workflow.id,
      worksteps: workflow.worksteps,
    } as WorkflowDto;
  }
}
