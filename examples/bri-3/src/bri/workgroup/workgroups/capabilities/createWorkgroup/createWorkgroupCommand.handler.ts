import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkgroupAgent } from '../../agents/workgroups.agent';
import { WorkgroupStorageAgent } from '../../agents/workgroupStorage.agent';
import { CreateWorkgroupCommand } from './createWorkgroup.command';

@CommandHandler(CreateWorkgroupCommand)
export class CreateWorkgroupCommandHandler
  implements ICommandHandler<CreateWorkgroupCommand>
{
  constructor(
    private agent: WorkgroupAgent,
    private storageAgent: WorkgroupStorageAgent,
  ) {}

  async execute(command: CreateWorkgroupCommand) {
    const administratorsToConnect =
      await this.agent.fetchWorkgroupAdministratorsAndThrowIfNoneExist(
        command.administratorIds,
      );

    const participantsToConnect =
      await this.agent.fetchWorkgroupParticipantsAndThrowIfNoneExist(
        command.participantIds,
      );

    const newWorkgroupCandidate = this.agent.createNewWorkgroup(
      command.name,
      administratorsToConnect,
      command.securityPolicy,
      command.privacyPolicy,
      participantsToConnect,
      [],
      [],
    );

    const newWorkgroup = await this.storageAgent.createNewWorkgroup(
      newWorkgroupCandidate,
    );

    return newWorkgroup.id;
  }
}
