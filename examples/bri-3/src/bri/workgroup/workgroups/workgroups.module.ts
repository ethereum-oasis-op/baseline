import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SubjectModule } from '../../identity/bpiSubjects/subjects.module';
import { WorkflowModule } from '../workflows/workflows.module';
import { WorkstepModule } from '../worksteps/worksteps.module';
import { WorkgroupAgent } from './agents/workgroups.agent';
import { WorkgroupStorageAgent } from './agents/workgroupStorage.agent';
import { WorkgroupController } from './api/workgroups.controller';
import { CreateWorkgroupCommandHandler } from './capabilities/createWorkgroup/createWorkgroupCommand.handler';
import { GetWorkgroupByIdQueryHandler } from './capabilities/getWorkgroupById/getWorkgroupByIdQuery.handler';

export const CommandHandlers = [CreateWorkgroupCommandHandler];
export const QueryHandlers = [GetWorkgroupByIdQueryHandler];
@Module({
  imports: [CqrsModule, SubjectModule, WorkstepModule, WorkflowModule],
  controllers: [WorkgroupController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    WorkgroupAgent,
    WorkgroupStorageAgent,
  ],
})
export class WorkgroupModule {}
