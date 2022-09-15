import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkstepAgent } from '../../agents/worksteps.agent';
import { UpdateWorkstepCommand } from './updateWorkstep.command';

@CommandHandler(UpdateWorkstepCommand)
export class UpdateWorkstepCommandHandler
  implements ICommandHandler<UpdateWorkstepCommand>
{
  constructor(private agent: WorkstepAgent) {}

  async execute(command: UpdateWorkstepCommand) {
    // const { name, id, workgroupId } = command;

    // this.agent.throwIfUpdateWorkstepInputInvalid(name, id, workgroupId);

    // const updatedWorkstep = this.agent.updateWorkstep(name, id, workgroupId);

    // // TODO: Generic map of domain model to entity model
    // // this.orm.store(newWorkstep);

    // // TODO: Response DTO
    return true;
  }
}
