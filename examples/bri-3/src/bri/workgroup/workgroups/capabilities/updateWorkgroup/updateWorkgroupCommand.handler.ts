import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkgroupAgent } from '../../agents/workgroups.agent';
import { WorkgroupStorageAgent } from '../../agents/workgroupStorage.agent';
import { UpdateWorkgroupCommand } from './updateWorkgroup.command';

@CommandHandler(UpdateWorkgroupCommand)
export class UpdateWorkgroupCommandHandler
  implements ICommandHandler<UpdateWorkgroupCommand>
{
  constructor(
    private agent: WorkgroupAgent,
    private storageAgent: WorkgroupStorageAgent,
  ) {}

  async execute(command: UpdateWorkgroupCommand) {
    const adminstratorsToUpdate =
      await this.agent.fetchBpiSubjectsByIdAndThrowIfNoneExist(
        command.administratorIds,
      );

    const participantsToUpdate =
      await this.agent.fetchBpiSubjectsByIdAndThrowIfNoneExist(
        command.participantIds,
      );

    const workgroupToUpdate =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateWorkgroup(
      workgroupToUpdate,
      command.name,
      adminstratorsToUpdate,
      command.securityPolicy,
      command.privacyPolicy,
      participantsToUpdate,
    );

    await this.storageAgent.updateWorkgroup(workgroupToUpdate);
  }
}
