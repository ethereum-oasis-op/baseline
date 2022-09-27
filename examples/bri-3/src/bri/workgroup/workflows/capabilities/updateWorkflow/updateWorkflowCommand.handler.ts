import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkflowAgent } from '../../agents/workflows.agent';
import { WorkflowStorageAgent } from '../../agents/workflowsStorage.agent';
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

    this.agent.updateWorkflow(
      workflowToUpdate,
      command.name,
      command.worksteps,
      command.workgroupId,
    );

    await this.storageAgent.updateWorkflow(workflowToUpdate);
  }
}
