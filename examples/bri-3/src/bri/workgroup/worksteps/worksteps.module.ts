import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkstepAgent } from './agents/worksteps.agent';
import { WorkstepController } from './api/worksteps.controller';
import { CreateWorkstepCommandHandler } from './capabilities/createWorkstep/createWorkstep.command.handler';

export const CommandHandlers = [CreateWorkstepCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [WorkstepController],
  providers: [...CommandHandlers, WorkstepAgent],
})
export class WorkstepsModule {}
