import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAgent } from '../../../../identity/bpiSubjects/agents/bpiSubjects.agent';
import { WorkgroupAgent } from '../../agents/workgroups.agent';
import { WorkgroupStorageAgent } from '../../agents/workgroupStorage.agent';
import { UpdateWorkgroupCommand } from './updateWorkgroup.command';

@CommandHandler(UpdateWorkgroupCommand)
export class UpdateWorkgroupCommandHandler
  implements ICommandHandler<UpdateWorkgroupCommand>
{
  constructor(
    private workgroupAgent: WorkgroupAgent,
    private workgroupStorageAgent: WorkgroupStorageAgent,
    private bpiSubjectAgent: BpiSubjectAgent,
  ) {}

  async execute(command: UpdateWorkgroupCommand) {
    const adminstratorsToUpdate =
      await this.bpiSubjectAgent.fetchUpdateCandidatesAndThrowIfValidationFails(
        command.administratorIds,
      );

    const participantsToUpdate =
      await this.bpiSubjectAgent.fetchUpdateCandidatesAndThrowIfValidationFails(
        command.participantIds,
      );

    const workgroupToUpdate =
      await this.workgroupAgent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.workgroupAgent.updateWorkgroup(
      workgroupToUpdate,
      command.name,
      adminstratorsToUpdate,
      command.securityPolicy,
      command.privacyPolicy,
      participantsToUpdate,
    );

    return await this.workgroupStorageAgent.updateWorkgroup(workgroupToUpdate);
  }
}
