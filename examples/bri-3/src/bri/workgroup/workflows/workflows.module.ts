import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkstepStorageAgent } from '../worksteps/agents/workstepsStorage.agent';
import { WorkflowAgent } from './agents/workflows.agent';
import { WorkflowController } from './api/workflows.controller';
import { CreateWorkflowCommandHandler } from './capabilities/createWorkflow/createWorkflowCommand.handler';
import { DeleteWorkflowCommandHandler } from './capabilities/deleteWorkflow/deleteWorkflowCommand.handler';
import { GetAllWorkflowsQueryHandler } from './capabilities/getAllWorkflows/getAllWorkflowsQuery.handler';
import { GetWorkflowByIdQueryHandler } from './capabilities/getWorkflowById/getWorkflowByIdQuery.handler';
import { UpdateWorkflowCommandHandler } from './capabilities/updateWorkflow/updateWorkflowCommand.handler';

export const CommandHandlers = [
  CreateWorkflowCommandHandler,
  UpdateWorkflowCommandHandler,
  DeleteWorkflowCommandHandler,
];

export const QueryHandlers = [
  GetWorkflowByIdQueryHandler,
  GetAllWorkflowsQueryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [WorkflowController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    WorkflowAgent,
    WorkstepStorageAgent,
  ],
})
export class WorkflowsModule {}
