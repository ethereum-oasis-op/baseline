import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaMapper } from '../../../../prisma/prisma.mapper';
import { PrismaModule } from '../../../shared/prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { SubjectModule } from '../../identity/bpiSubjects/subjects.module';
import { WorkflowModule } from '../workflows/workflows.module';
import { WorkstepModule } from '../worksteps/worksteps.module';
import { WorkgroupStorageAgent } from './agents/workgroupStorage.agent';
import { WorkgroupAgent } from './agents/workgroups.agent';
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
    PrismaModule,
  ],
  controllers: [WorkgroupController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    WorkgroupAgent,
    WorkgroupStorageAgent,
    WorkgroupProfile,
    PrismaMapper,
  ],
  exports: [WorkgroupAgent],
})
export class WorkgroupModule {}
