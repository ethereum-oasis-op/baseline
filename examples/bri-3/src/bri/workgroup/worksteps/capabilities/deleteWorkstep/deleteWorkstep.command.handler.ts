import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkstepAgent } from '../../agents/worksteps.agent';
import { DeleteWorkstepCommand } from './deleteWorkstep.command';

@CommandHandler(DeleteWorkstepCommand)
export class DeleteWorkstepCommandHandler
  implements ICommandHandler<DeleteWorkstepCommand>
{
  constructor(private agent: WorkstepAgent) {}

  async execute(command: DeleteWorkstepCommand) {
    const { name, id, workgroupId } = command;

    this.agent.throwIfDeleteWorkstepInputInvalid(name, id, workgroupId);

    const deletedWorkstep = this.agent.deleteWorkstep(name, id, workgroupId);

    // TODO: Generic map of domain model to entity model
    // this.orm.store(newWorkstep);

    // TODO: Response DTO
    return true;
  }
}
