import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiMessageAgent } from '../../agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { MessagingAgent } from '../../agents/messaging.agent';
import { ProcessInboundBpiMessageCommand } from './processInboundMessage.command';

// Difference between this and the create bpi message command handler is that this one does not
// want to stop the execution flow by throwing a nestjs exception (which results in 404 response in the other handler)
// TODO: Consider using a NestJs Saga or another command dispatch to avoid code duplication
@CommandHandler(ProcessInboundBpiMessageCommand)
export class ProcessInboundMessageCommandHandler
  implements ICommandHandler<ProcessInboundBpiMessageCommand>
{
  constructor(
    private readonly agent: BpiMessageAgent,
    private readonly storageAgent: BpiMessageStorageAgent,
    private readonly messagingAgent: MessagingAgent,
  ) {}

  async execute(command: ProcessInboundBpiMessageCommand) {
    const [isValid, fromBpiSubject, toBpiSubject] =
      await this.agent.validateNewBpiMessageAgainstExistingBpiEntities(
        command.id,
        command.from,
        command.to,
      );

    if (!isValid) {
      return;
    }

    // TODO: #649 - Validate the signature and the pk of the sender

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
    // Wiil be improved by introducing NATS authz to allow only the recipient Bpi Subject to listen on this channel (#648)
    await this.messagingAgent.publishMessage(
      toBpiSubject.publicKey,
      this.messagingAgent.serializeBpiMessage(newBpiMessage),
    );
  }
}
