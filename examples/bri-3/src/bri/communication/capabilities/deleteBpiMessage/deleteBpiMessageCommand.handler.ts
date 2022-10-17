import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiMessageAgent } from '../../agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { DeleteBpiMessageCommand } from './deleteBpiMessage.command';

@CommandHandler(DeleteBpiMessageCommand)
export class DeleteBpiMessageCommandHandler
  implements ICommandHandler<DeleteBpiMessageCommand>
{
  constructor(
    private readonly agent: BpiMessageAgent,
    private readonly storageAgent: BpiMessageStorageAgent,
  ) {}

  async execute(command: DeleteBpiMessageCommand) {
    const bpiMessageToDelete =
      await this.agent.fetchDeleteCandidateAndThrowIfDeleteValidationFails(
        command.id,
      );
    await this.storageAgent.deleteBpiMessage(bpiMessageToDelete);

    return;
  }
}
