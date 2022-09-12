import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkflowAgent } from './agents/workflows.agent';
import { WorkflowController } from './api/workflows.controller';
import { CreateWorkflowCommandHandler } from './capabilities/createWorkflow/createWorkflowCommand.handler';

export const CommandHandlers = [CreateWorkflowCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [WorkflowController],
  providers: [...CommandHandlers, WorkflowAgent],
})
export class WorkflowsModule {}
