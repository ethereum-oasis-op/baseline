import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkflowAgent } from '../../agents/workflows.agent';
import { CreateWorkflowCommand } from './createWorkflow.command';

@CommandHandler(CreateWorkflowCommand)
export class CreateWorkflowCommandHandler
  implements ICommandHandler<CreateWorkflowCommand>
{
  constructor(
    private agent: WorkflowAgent,
    private storageAgent: WorkflowStorageAgent,
  ) {}

  async execute(command: CreateWorkflowCommand) {
    const newWorkflowCandidate = this.agent.createNewWorkflow(
      command.worksteps,
    );

    const newWorkflow = await this.storageAgent.createNewWorkflow(
      newWorkflowCandidate,
    );

    return newWorkflow.id;
  }
}
