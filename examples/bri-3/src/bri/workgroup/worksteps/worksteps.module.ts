import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkstepAgent } from './agents/worksteps.agent';
import { WorkstepController } from './api/worksteps.controller';
import { CreateWorkstepCommandHandler } from './capabilities/createWorkstep/createWorkstepCommand.handler';
import { DeleteWorkstepCommandHandler } from './capabilities/deleteWorkstep/deleteWorkstepCommand.handler';
import { GetAllWorkstepsQueryHandler } from './capabilities/getAllWorksteps/getAllWorkstepsQuery.handler';
import { GetWorkstepByIdQueryHandler } from './capabilities/getWorkstepById/getWorkstepByIdQuery.handler';
import { UpdateWorkstepCommandHandler } from './capabilities/updateWorkstep/updateWorkstep.command.handler';
import { WorkstepStorageAgent } from './agents/workstepsStorage.agent';
import { LoggingModule } from '../../../../src/shared/logging/logging.module';
import { WorkstepProfile } from './workstep.profile';
import { PrismaModule } from '../../../shared/prisma/prisma.module';

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
  ],
  exports: [WorkstepAgent, WorkstepStorageAgent],
})
export class WorkstepModule {}
