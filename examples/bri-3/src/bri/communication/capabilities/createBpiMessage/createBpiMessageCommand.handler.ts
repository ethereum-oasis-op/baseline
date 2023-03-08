import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EncryptionService } from '../../../../shared/encryption/encryption.service';
import { AuthAgent } from '../../../auth/agent/auth.agent';
import { BpiMessageAgent } from '../../agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { MessagingAgent } from '../../agents/messaging.agent';
import { CreateBpiMessageCommand } from './createBpiMessage.command';

@CommandHandler(CreateBpiMessageCommand)
export class CreateBpiMessageCommandHandler
  implements ICommandHandler<CreateBpiMessageCommand>
{
  constructor(
    private readonly agent: BpiMessageAgent,
    private readonly storageAgent: BpiMessageStorageAgent,
    private readonly messagingAgent: MessagingAgent,
    private readonly authAgent: AuthAgent,
    private readonly cryptoService: EncryptionService,
  ) {}

  async execute(command: CreateBpiMessageCommand) {
    await this.agent.throwIfBpiMessageIdExists(command.id);

    const fromBpiSubject = await this.agent.fetchBpiSubjectAndThrowIfNotExists(
      command.from,
    );

    const toBpiSubject = await this.agent.fetchBpiSubjectAndThrowIfNotExists(
      command.to,
    );

    this.authAgent.throwIfSignatureVerificationFails(
      command.content,
      command.signature,
      fromBpiSubject.publicKey,
    );

    const newBpiMessageCandidate = this.agent.createNewBpiMessage(
      command.id,
      fromBpiSubject,
      toBpiSubject,
      command.content,
      command.signature,
      command.type,
    );

    newBpiMessageCandidate.content = await this.cryptoService.encrypt(
      newBpiMessageCandidate.content,
    );

    const newBpiMessage = await this.storageAgent.storeNewBpiMessage(
      newBpiMessageCandidate,
    );

    await this.messagingAgent.publishMessage(
      toBpiSubject.publicKey,
      this.messagingAgent.serializeBpiMessage(newBpiMessage),
    );

    return newBpiMessage.id;
  }
}
