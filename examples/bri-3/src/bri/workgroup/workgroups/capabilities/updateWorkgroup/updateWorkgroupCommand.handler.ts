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
      await this.agent.fetchWorkgroupAdministratorsAndThrowIfNoneExist(
        command.administratorIds,
      );

    const participantsToUpdate =
      await this.agent.fetchWorkgroupParticipantsAndThrowIfNoneExist(
        command.participantIds,
      );

    const workstepsToUpdate =
      await this.agent.fetchWorkstepCandidatesAndThrowIfNoneExist(
        command.workstepIds,
      );

    const workflowsToUpdate =
      await this.agent.fetchWorkflowCandidatesAndThrowIfNoneExist(
        command.workflowIds,
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
      workstepsToUpdate,
      workflowsToUpdate,
    );

    await this.storageAgent.updateWorkgroup(workgroupToUpdate);
  }
}
