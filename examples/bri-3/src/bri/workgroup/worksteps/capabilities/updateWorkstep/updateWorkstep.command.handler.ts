import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkstepAgent } from '../../agents/worksteps.agent';
import { WorkstepStorageAgent } from '../../agents/workstepsStorage.agent';
import { UpdateWorkstepCommand } from './updateWorkstep.command';

@CommandHandler(UpdateWorkstepCommand)
export class UpdateWorkstepCommandHandler
  implements ICommandHandler<UpdateWorkstepCommand>
{
  constructor(
    private agent: WorkstepAgent,
    private storageAgent: WorkstepStorageAgent,
  ) {}

  async execute(command: UpdateWorkstepCommand) {
    const workstepToUpdate =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateWorkstep(
      workstepToUpdate,
      command.name,
      command.version,
      command.status,
      command.workgroupId,
      command.securityPolicy,
      command.privacyPolicy,
    );

    return await this.storageAgent.updateWorkstep(workstepToUpdate);
  }
}
