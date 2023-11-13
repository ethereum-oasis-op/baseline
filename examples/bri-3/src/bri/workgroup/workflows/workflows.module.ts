import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountModule } from '../../identity/bpiAccounts/accounts.module';
import { SubjectAccountModule } from '../../identity/bpiSubjectAccounts/subjectAccounts.module';
import { SubjectModule } from '../../identity/bpiSubjects/subjects.module';
import { WorkgroupStorageAgent } from '../workgroups/agents/workgroupStorage.agent';
import { WorkgroupAgent } from '../workgroups/agents/workgroups.agent';
import { WorkstepModule } from '../worksteps/worksteps.module';
import { WorkflowAgent } from './agents/workflows.agent';
import { WorkflowStorageAgent } from './agents/workflowsStorage.agent';
import { WorkflowController } from './api/workflows.controller';
import { CreateWorkflowCommandHandler } from './capabilities/createWorkflow/createWorkflowCommand.handler';
import { DeleteWorkflowCommandHandler } from './capabilities/deleteWorkflow/deleteWorkflowCommand.handler';
import { GetAllWorkflowsQueryHandler } from './capabilities/getAllWorkflows/getAllWorkflowsQuery.handler';
import { GetWorkflowByIdQueryHandler } from './capabilities/getWorkflowById/getWorkflowByIdQuery.handler';
import { UpdateWorkflowCommandHandler } from './capabilities/updateWorkflow/updateWorkflowCommand.handler';
import { WorkflowProfile } from './workflow.profile';
import { PrismaModule } from '../../../shared/prisma/prisma.module';

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
  imports: [
    CqrsModule,
    WorkstepModule,
    AccountModule,
    SubjectAccountModule,
    SubjectModule,
    PrismaModule,
  ],
  controllers: [WorkflowController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    WorkflowAgent,
    WorkflowStorageAgent,
    WorkflowProfile,
    // TODO: Circular dependency if Workgroup module is imported above
    // for the two providers below - resolve.
    WorkgroupAgent,
    WorkgroupStorageAgent,
  ],
  exports: [WorkflowAgent, WorkflowStorageAgent],
})
export class WorkflowModule {}
