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
      await this.workgroupAgent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.workgroupAgent.archiveWorkgroup(workgroupToArchive, command.status);

    await this.workgroupStorageAgent.archiveWorkgroup(workgroupToArchive);
  }
}
