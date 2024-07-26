import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkstepAgent } from '../../agents/worksteps.agent';
import { WorkstepStorageAgent } from '../../agents/workstepsStorage.agent';
import { CreateWorkstepCommand } from './createWorkstep.command';

@CommandHandler(CreateWorkstepCommand)
export class CreateWorkstepCommandHandler
  implements ICommandHandler<CreateWorkstepCommand>
{
  constructor(
    private agent: WorkstepAgent,
    private storageAgent: WorkstepStorageAgent,
  ) {}

  async execute(command: CreateWorkstepCommand) {
    const newWorkstepCandidate = this.agent.createNewWorkstep(
      command.name,
      command.version,
      command.status,
      command.workgroupId,
      command.securityPolicy,
      command.privacyPolicy,
      command.verifierContractAddress
    );

    const newWorkstep = await this.storageAgent.storeNewWorkstep(
      newWorkstepCandidate,
    );

    return newWorkstep.id;
  }
}
