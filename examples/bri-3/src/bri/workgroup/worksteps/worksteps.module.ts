import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaMapper } from '../../../../prisma/prisma.mapper';
import { LoggingModule } from '../../../../src/shared/logging/logging.module';
import { PrismaModule } from '../../../shared/prisma/prisma.module';
import { WorkstepAgent } from './agents/worksteps.agent';
import { WorkstepStorageAgent } from './agents/workstepsStorage.agent';
import { WorkstepController } from './api/worksteps.controller';
import { CreateWorkstepCommandHandler } from './capabilities/createWorkstep/createWorkstepCommand.handler';
import { DeleteWorkstepCommandHandler } from './capabilities/deleteWorkstep/deleteWorkstepCommand.handler';
import { GetAllWorkstepsQueryHandler } from './capabilities/getAllWorksteps/getAllWorkstepsQuery.handler';
import { GetWorkstepByIdQueryHandler } from './capabilities/getWorkstepById/getWorkstepByIdQuery.handler';
import { UpdateWorkstepCommandHandler } from './capabilities/updateWorkstep/updateWorkstep.command.handler';
import { WorkstepProfile } from './workstep.profile';

export const CommandHandlers = [
  CreateWorkstepCommandHandler,
  UpdateWorkstepCommandHandler,
  DeleteWorkstepCommandHandler,
];

export const QueryHandlers = [
  GetWorkstepByIdQueryHandler,
  GetAllWorkstepsQueryHandler,
];

@Module({
  imports: [CqrsModule, LoggingModule, PrismaModule],
  controllers: [WorkstepController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    WorkstepAgent,
    WorkstepStorageAgent,
    WorkstepProfile,
    PrismaMapper,
  ],
  exports: [WorkstepAgent, WorkstepStorageAgent],
})
export class WorkstepModule {}
