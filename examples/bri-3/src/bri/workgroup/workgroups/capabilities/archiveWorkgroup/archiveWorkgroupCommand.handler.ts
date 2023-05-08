import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkgroupAgent } from '../../agents/workgroups.agent';
import { WorkgroupStorageAgent } from '../../agents/workgroupStorage.agent';
import { ArchiveWorkgroupCommand } from './archiveWorkgroup.command';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Workgroup } from '../../models/workgroup';
import { WorkgroupDto } from '../../api/dtos/response/workgroup.dto';

@CommandHandler(ArchiveWorkgroupCommand)
export class ArchiveWorkgroupCommandHandler
  implements ICommandHandler<ArchiveWorkgroupCommand>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private workgroupAgent: WorkgroupAgent,
    private workgroupStorageAgent: WorkgroupStorageAgent,
  ) {}

  async execute(command: ArchiveWorkgroupCommand) {
    const workgroupToArchive =
      await this.workgroupAgent.fetchArchiveCandidateAndThrowIfArchiveValidationFails(
        command.id,
      );

    this.workgroupAgent.archiveWorkgroup(workgroupToArchive);

    const updatedWorkgroup = await this.workgroupStorageAgent.updateWorkgroup(
      workgroupToArchive,
    );

    return this.mapper.map(updatedWorkgroup, Workgroup, WorkgroupDto);
  }
}
