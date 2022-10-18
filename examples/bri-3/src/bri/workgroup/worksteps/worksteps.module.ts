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
import Mapper from '../../utils/mapper';

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
  imports: [CqrsModule],
  controllers: [WorkstepController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    WorkstepAgent,
    WorkstepStorageAgent,
    Mapper,
  ],
  exports: [WorkstepAgent, WorkstepStorageAgent],
})
export class WorkstepModule {}
