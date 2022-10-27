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
    const workgroupAdministrators =
      await this.agent.fetchWorkgroupAdministratorsAndThrowIfNoneExist(
        command.administratorIds,
      );

    const workgroupParticipants =
      await this.agent.fetchWorkgroupParticipantsAndThrowIfNoneExist(
        command.participantIds,
      );

    const newWorkgroupCandidate = this.agent.createNewWorkgroup(
      command.name,
      workgroupAdministrators,
      command.securityPolicy,
      command.privacyPolicy,
      workgroupParticipants,
      [],
      [],
    );

    const newWorkgroup = await this.storageAgent.createNewWorkgroup(
      newWorkgroupCandidate,
    );

    return newWorkgroup.id;
  }
}
