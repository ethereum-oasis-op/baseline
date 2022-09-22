import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkflowAgent } from '../../agents/workflows.agent';
import { DeleteWorkflowCommand } from './deleteWorkflow.command';

@CommandHandler(DeleteWorkflowCommand)
export class DeleteWorkflowCommandHandler
  implements ICommandHandler<DeleteWorkflowCommand>
{
  constructor(
    private agent: WorkflowAgent,
    private storageAgent: WorkflowStorageAgent,
  ) {}

  async execute(command: DeleteWorkflowCommand) {
    const workflowToDelete =
      await this.agent.fetchDeleteCandidateAndThrowIfDeleteValidationFails(
        command.id,
      );

    await this.storageAgent.deleteWorkflow(workflowToDelete);
  }
}
