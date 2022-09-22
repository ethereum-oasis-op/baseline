import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkflowAgent } from '../../agents/workflows.agent';
import { UpdateWorkflowCommand } from './updateWorkflow.command';

@CommandHandler(UpdateWorkflowCommand)
export class UpdateWorkflowCommandHandler
  implements ICommandHandler<UpdateWorkflowCommand>
{
  constructor(
    private agent: WorkflowAgent,
    private storageAgent: WorkflowStorageAgent,
  ) {}

  async execute(command: UpdateWorkflowCommand) {
    const workflowToUpdate =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateWorkflow(workflowToUpdate, command.worksteps);

    await this.storageAgent.updateWorkflow(workflowToUpdate);
  }
}
