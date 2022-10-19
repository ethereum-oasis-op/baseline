import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkflowAgent } from '../../agents/workflows.agent';
import { WorkflowStorageAgent } from '../../agents/workflowsStorage.agent';
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
    const workstepsToConnect =
      await this.agent.fetchWorkstepCandidatesForWorkflowAndThrowIfExistenceValidationFails(
        command.workstepIds,
      );

    const newWorkflowCandidate = this.agent.createNewWorkflow(
      command.name,
      workstepsToConnect,
      command.workgroupId,
    );

    const newWorkflow = await this.storageAgent.createNewWorkflow(
      newWorkflowCandidate,
    );

    return newWorkflow.id;
  }
}
