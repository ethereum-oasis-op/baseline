import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../../auth/auth.module';
import { BpiSubjectAgent } from '../../identity/bpiSubjects/agents/bpiSubjects.agent';
import { SubjectModule } from '../../identity/bpiSubjects/subjects.module';
import { WorkflowModule } from '../workflows/workflows.module';
import { WorkstepModule } from '../worksteps/worksteps.module';
import { WorkgroupAgent } from './agents/workgroups.agent';
import { WorkgroupStorageAgent } from './agents/workgroupStorage.agent';
import { WorkgroupController } from './api/workgroups.controller';
import { ArchiveWorkgroupCommandHandler } from './capabilities/archiveWorkgroup/archiveWorkgroupCommand.handler';
import { CreateWorkgroupCommandHandler } from './capabilities/createWorkgroup/createWorkgroupCommand.handler';
import { DeleteWorkgroupCommandHandler } from './capabilities/deleteWorkgroup/deleteWorkgroupCommand.handler';
import { GetWorkgroupByIdQueryHandler } from './capabilities/getWorkgroupById/getWorkgroupByIdQuery.handler';
import { UpdateWorkgroupCommandHandler } from './capabilities/updateWorkgroup/updateWorkgroupCommand.handler';
import { WorkgroupProfile } from './workgroups.profile';

export const CommandHandlers = [
  CreateWorkgroupCommandHandler,
  UpdateWorkgroupCommandHandler,
  ArchiveWorkgroupCommandHandler,
  DeleteWorkgroupCommandHandler,
];

export const QueryHandlers = [GetWorkgroupByIdQueryHandler];
@Module({
  imports: [
    CqrsModule,
    SubjectModule,
    WorkstepModule,
    WorkflowModule,
    AuthModule,
  ],
  controllers: [WorkgroupController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    WorkgroupAgent,
    WorkgroupStorageAgent,
    WorkgroupProfile,
  ],
  exports: [WorkgroupAgent],
})
export class WorkgroupModule {}
