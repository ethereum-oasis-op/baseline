import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkgroupAgent } from '../../agents/workgroups.agent';
import { WorkgroupStorageAgent } from '../../agents/workgroupStorage.agent';
import { DeleteWorkgroupCommand } from './deleteWorkgroup.command';

@CommandHandler(DeleteWorkgroupCommand)
export class DeleteWorkgroupCommandHandler
  implements ICommandHandler<DeleteWorkgroupCommand>
{
  constructor(
    private agent: WorkgroupAgent,
    private storageAgent: WorkgroupStorageAgent,
  ) {}

  async execute(command: DeleteWorkgroupCommand) {
    const workgroupToDelete =
      await this.agent.fetchDeleteCandidateAndThrowIfDeleteValidationFails(
        command.id,
      );

    await this.storageAgent.deleteWorkgroup(workgroupToDelete);
  }
}
