import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EncryptionService } from '../../../../shared/encryption/encryption.service';
import { BpiMessageAgent } from '../../agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { BpiMessage } from '../../models/bpiMessage';
import { UpdateBpiMessageCommand } from './updateBpiMessage.command';

@CommandHandler(UpdateBpiMessageCommand)
export class UpdateBpiMessageCommandHandler
  implements ICommandHandler<UpdateBpiMessageCommand>
{
  constructor(
    private agent: BpiMessageAgent,
    private storageAgent: BpiMessageStorageAgent,
    private cryptoService: EncryptionService,
  ) {}

  async execute(command: UpdateBpiMessageCommand) {
    const bpiMessageToUpdate: BpiMessage =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateBpiMessage(
      bpiMessageToUpdate,
      command.content,
      command.signature,
    );

    bpiMessageToUpdate.content = await this.cryptoService.encrypt(
      bpiMessageToUpdate.content,
    );

    return await this.storageAgent.updateBpiMessage(bpiMessageToUpdate);
  }
}
