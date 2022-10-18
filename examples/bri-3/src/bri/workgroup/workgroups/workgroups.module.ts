import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkgroupAgent } from './agents/workgroups.agent';
import { WorkgroupController } from './api/workgroups.controller';
import { CreateWorkgroupCommandHandler } from './capabilities/createWorkgroup/createWorkgroupCommand.handler';
import { GetWorkgroupByIdQueryHandler } from './capabilities/getWorkgroupById/getWorkgroupByIdQuery.handler';
import { WorkgroupRepository } from './persistence/workgroup.repository';

export const CommandHandlers = [CreateWorkgroupCommandHandler];
export const QueryHandlers = [GetWorkgroupByIdQueryHandler];
@Module({
  imports: [CqrsModule],
  controllers: [WorkgroupController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    WorkgroupAgent,
    WorkgroupRepository,
  ],
})
export class WorkgroupModule {}
