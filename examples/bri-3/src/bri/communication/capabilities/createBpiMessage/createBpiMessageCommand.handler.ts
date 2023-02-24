import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
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

    const newBpiMessage = await this.storageAgent.storeNewBpiMessage(
      newBpiMessageCandidate,
    );

    // TODO: This is naive as it publishes to a channel anyone who can auth with the NATS server can subscribe to.
    // Will be improved by introducing NATS authz to allow only the recipient Bpi Subject to listen on this channel (#648)
    await this.messagingAgent.publishMessage(
      toBpiSubject.publicKey,
      this.messagingAgent.serializeBpiMessage(newBpiMessage),
    );

    return newBpiMessage.id;
  }
}
