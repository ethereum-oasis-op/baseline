import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAgent } from '../../../../identity/bpiSubjects/agents/bpiSubjects.agent';
import { WorkgroupAgent } from '../../agents/workgroups.agent';
import { WorkgroupStorageAgent } from '../../agents/workgroupStorage.agent';
import { UpdateWorkgroupCommand } from './updateWorkgroup.command';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Workgroup } from '../../models/workgroup';
import { WorkgroupDto } from '../../api/dtos/response/workgroup.dto';

@CommandHandler(UpdateWorkgroupCommand)
export class UpdateWorkgroupCommandHandler
  implements ICommandHandler<UpdateWorkgroupCommand>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
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

    const updatedWorkgroup = await this.workgroupStorageAgent.updateWorkgroup(
      workgroupToUpdate,
    );

    return this.mapper.map(updatedWorkgroup, Workgroup, WorkgroupDto);
  }
}
