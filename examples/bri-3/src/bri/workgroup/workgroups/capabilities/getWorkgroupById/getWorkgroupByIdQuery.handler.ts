import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WorkgroupStorageAgent } from '../../agents/workgroupStorage.agent';
import { WorkgroupDto } from '../../api/dtos/response/workgroup.dto';
import { GetWorkgroupByIdQuery } from './getWorkgroupById.query';

@QueryHandler(GetWorkgroupByIdQuery)
export class GetWorkgroupByIdQueryHandler
  implements IQueryHandler<GetWorkgroupByIdQuery>
{
  constructor(private readonly storageAgent: WorkgroupStorageAgent) {}

  async execute(query: GetWorkgroupByIdQuery) {
    const workgroup = await this.storageAgent.getWorkgroupById(query.id);

    return {
      id: workgroup.id,
      name: workgroup.name,
      administrators: workgroup.administrator,
      securityPolicy: workgroup.securityPolicy,
      privacyPolicy: workgroup.privacyPolicy,
      participants: workgroup.participants,
      worksteps: workgroup.worksteps,
      workflows: workgroup.workflows,
    } as WorkgroupDto;
  }
}
