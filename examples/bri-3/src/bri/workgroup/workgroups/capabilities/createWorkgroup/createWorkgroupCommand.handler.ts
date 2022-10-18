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
        command.workstepIds,
      );

    const workflowsToConnect =
      await this.agent.fetchWorkflowCandidatesAndThrowIfNoneExist(
        command.workstepIds,
      );

    const participantsToConnect =
      await this.agent.fetchWorkgroupParticipantsAndThrowIfNoneExist(
        command.workstepIds,
      );

    const workstepsToConnect =
      await this.agent.fetchWorkstepCandidatesAndThrowIfNoneExist(
        command.workstepIds,
      );

    const newWorkgroupCandidate = this.agent.createNewWorkgroup(
      command.name,
      administratorsToConnect,
      command.securityPolicy,
      command.privacyPolicy,
      participantsToConnect,
      workstepsToConnect,
      workflowsToConnect,
    );

    const newWorkgroup = await this.storageAgent.createNewWorkgroup(
      newWorkgroupCandidate,
    );

    return newWorkgroup.id;
  }
}
