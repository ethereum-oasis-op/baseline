import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkflowAgent } from '../../agents/workflows.agent';
import { CreateWorkflowCommand } from './createWorkflow.command';

@CommandHandler(CreateWorkflowCommand)
export class CreateWorkflowCommandHandler
  implements ICommandHandler<CreateWorkflowCommand>
{
  constructor(private agent: WorkflowAgent) {}

  async execute(command: CreateWorkflowCommand) {
    this.agent.throwIfCreateWorkflowInputInvalid(command._worksteps);

    const newWorkflow = this.agent.createNewWorkflow(command._worksteps);

    // TODO: Generic map of domain model to entity model
    // this.orm.store(newWorkflow);

    // TODO: Response DTO
    return true;
  }
}
