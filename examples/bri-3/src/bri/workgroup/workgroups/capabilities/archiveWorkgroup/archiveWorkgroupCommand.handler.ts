import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkgroupAgent } from '../../agents/workgroups.agent';
import { WorkgroupStorageAgent } from '../../agents/workgroupStorage.agent';
import { ArchiveWorkgroupCommand } from './archiveWorkgroup.command';

@CommandHandler(ArchiveWorkgroupCommand)
export class ArchiveWorkgroupCommandHandler
  implements ICommandHandler<ArchiveWorkgroupCommand>
{
  constructor(
    private workgroupAgent: WorkgroupAgent,
    private workgroupStorageAgent: WorkgroupStorageAgent,
  ) {}

  async execute(command: ArchiveWorkgroupCommand) {
    const workgroupToArchive =
      await this.workgroupAgent.fetchArchiveCandidateAndThrowIfArchiveValidationFails(
        command.id,
      );

    this.workgroupAgent.archiveWorkgroup(workgroupToArchive);

    return await this.workgroupStorageAgent.updateWorkgroup(workgroupToArchive);
  }
}
