import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkflowAgent } from '../../agents/workflows.agent';
import { DeleteWorkflowCommand } from './deleteWorkflow.command';

@CommandHandler(DeleteWorkflowCommand)
export class DeleteWorkflowCommandHandler
  implements ICommandHandler<DeleteWorkflowCommand>
{
  constructor(private agent: WorkflowAgent) {}

  async execute(command: DeleteWorkflowCommand) {
    this.agent.throwIfDeleteWorkflowInputInvalid(command._id);

    const deletedWorkflow = this.agent.deleteWorkflow(command._id);

    // TODO: Generic map of domain model to entity model
    // this.orm.store(newWorkflow);

    // TODO: Response DTO
    return true;
  }
}
