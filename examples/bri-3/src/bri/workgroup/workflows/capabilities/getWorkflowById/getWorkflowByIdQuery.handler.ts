import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetWorkstepByIdQuery } from 'src/bri/workgroup/worksteps/capabilities/getWorkstepById/getWorkstepById.query';
import { WorkflowStorageAgent } from '../../agents/workflowsStorage.agent';
import { WorkflowDto } from '../../api/dtos/response/workflow.dto';
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
      name: workflow.name,
      worksteps: workflow.worksteps,
      workgroupId: workflow.workgroupId,
    } as WorkflowDto;
  }
}
