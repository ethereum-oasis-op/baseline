import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkstepAgent } from 'src/bri/workgroup/worksteps/agents/worksteps.agent';
import { WorkstepStorageAgent } from 'src/bri/workgroup/worksteps/agents/workstepsStorage.agent';
import { DeleteWorkstepCommand } from './deleteWorkgroup.command';

@CommandHandler(DeleteWorkstepCommand)
export class DeleteWorkstepCommandHandler
  implements ICommandHandler<DeleteWorkstepCommand>
{
  constructor(
    private agent: WorkstepAgent,
    private storageAgent: WorkstepStorageAgent,
  ) {}

  async execute(command: DeleteWorkstepCommand) {
    const workstepToDelete =
      await this.agent.fetchDeleteCandidateAndThrowIfDeleteValidationFails(
        command.id,
      );

    await this.storageAgent.deleteWorkstep(workstepToDelete);
  }
}
