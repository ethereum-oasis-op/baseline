import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkgroupAgent } from './workgroups/agents/workgroups.agent';
import { WorkgroupController } from './workgroups/api/workgroups.controller';
import { CreateWorkgroupCommandHandler } from './workgroups/capabilities/createWorkgroup/createWorkgroupCommand.handler';
import { GetWorkgroupByIdQueryHandler } from './workgroups/capabilities/getWorkgroupById/getWorkgroupByIdQuery.handler';
import { WorkgroupRepository } from './workgroups/persistence/workgroup.repository';

export const CommandHandlers = [CreateWorkgroupCommandHandler];
export const QueryHandlers = [GetWorkgroupByIdQueryHandler];
@Module({
  imports: [CqrsModule],
  controllers: [WorkgroupController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    WorkgroupAgent,
    WorkgroupRepository
  ]
})
export class WorkgroupModule {}
