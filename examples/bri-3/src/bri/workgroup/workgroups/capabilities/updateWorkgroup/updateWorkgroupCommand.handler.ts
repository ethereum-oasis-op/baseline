import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectStorageAgent } from '../../../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { WorkgroupAgent } from '../../agents/workgroups.agent';
import { WorkgroupStorageAgent } from '../../agents/workgroupStorage.agent';
import { UpdateWorkgroupCommand } from './updateWorkgroup.command';

@CommandHandler(UpdateWorkgroupCommand)
export class UpdateWorkgroupCommandHandler
  implements ICommandHandler<UpdateWorkgroupCommand>
{
  constructor(
    private agent: WorkgroupAgent,
    private workgroupStorageAgent: WorkgroupStorageAgent,
    private bpiSubjectStorageAgent: BpiSubjectStorageAgent,
  ) {}

  async execute(command: UpdateWorkgroupCommand) {
    const adminstratorsToUpdate =
      await this.bpiSubjectStorageAgent.getBpiSubjectsById(
        command.administratorIds,
      );

    const participantsToUpdate =
      await this.bpiSubjectStorageAgent.getBpiSubjectsById(
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

    await this.workgroupStorageAgent.updateWorkgroup(workgroupToUpdate);
  }
}
