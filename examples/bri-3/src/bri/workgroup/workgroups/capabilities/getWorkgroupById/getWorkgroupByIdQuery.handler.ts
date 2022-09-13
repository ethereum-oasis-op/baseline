import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WorkgroupDto } from '../../api/dtos/response/workgroup.dto';
import { GetWorkgroupByIdQuery } from './getWorkgroupById.query';

@QueryHandler(GetWorkgroupByIdQuery)
export class GetWorkgroupByIdQueryHandler implements IQueryHandler<GetWorkgroupByIdQuery> {
  constructor(private readonly repo: WorkgroupRepository) {}

  async execute(query: GetWorkgroupByIdQuery) {
    const workgroup = await this.repo.getWorkgroupById(query.id);
    return { //TODO: write generic mapper domainObject -> DTO
      id: workgroup.id,
      name: workgroup.name,
      administrator: workgroup.administrator,
      securityPolicy: workgroup.securityPolicy,
      privacyPolicy: workgroup.privacyPolicy,
      participants: workgroup.participants,
      worksteps: workgroup.worksteps,
      workflows: workgroup.workflows,
    } as WorkgroupDto;
  }
}
