import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkflowAgent } from '../../agents/workflows.agent';
import { UpdateWorkflowCommand } from './updateWorkflow.command';

@CommandHandler(UpdateWorkflowCommand)
export class UpdateWorkflowCommandHandler
  implements ICommandHandler<UpdateWorkflowCommand>
{
  constructor(private agent: WorkflowAgent) {}

  async execute(command: UpdateWorkflowCommand) {
    this.agent.throwIfUpdateWorkflowInputInvalid(command._worksteps);

    const updatedWorkflow = this.agent.updateWorkflow(command._worksteps);

    // TODO: Generic map of domain model to entity model
    // this.orm.store(newWorkflow);

    // TODO: Response DTO
    return true;
  }
}
