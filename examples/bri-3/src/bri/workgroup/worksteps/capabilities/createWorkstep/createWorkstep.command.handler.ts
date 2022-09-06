import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkstepAgent } from '../../agents/worksteps.agent';
import { CreateWorkstepCommand } from './createWorkstep.command';

@CommandHandler(CreateWorkstepCommand)
export class CreateWorkstepCommandHandler
  implements ICommandHandler<CreateWorkstepCommand>
{
  constructor(private agent: WorkstepAgent) {}

  async execute(command: CreateWorkstepCommand) {
    const { name, id, workgroupId } = command;

    this.agent.throwIfCreateWorkstepInputInvalid(name, id, workgroupId);

    const newWorkstep = this.agent.createNewWorkstep(name, id, workgroupId);

    // TODO: Generic map of domain model to entity model
    // this.orm.store(newWorkstep);

    // TODO: Response DTO
    return true;
  }
}
