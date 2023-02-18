import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoggingService } from '../../../../shared/logging/logging.service';
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
    private readonly logger: LoggingService,
  ) {}

  async execute(command: ProcessInboundBpiMessageCommand) {
    const existingBpiMessage = await this.storageAgent.getBpiMessageById(
      command.id,
    );

    if (existingBpiMessage) {
      this.logger.logError(
        `ProcessInboundMessageCommandHandler: BPI Message with id: ${existingBpiMessage.id} already exists.`,
      );
      return;
    }

    const [fromBpiSubject, toBpiSubject] =
      await this.agent.getFromAndToSubjects(command.from, command.to);

    if (!fromBpiSubject || !toBpiSubject) {
      this.logger.logError(
        `ProcessInboundMessageCommandHandler: From and\or To Bpi Subjects do not exist.`,
      );
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
    // Wiil be improved by introducing NATS authz to allow only the recipient Bpi Subject to listen on this channel
    await this.messagingAgent.publishMessage(
      toBpiSubject.publicKey,
      this.messagingAgent.serializeBpiMessage(newBpiMessage),
    );
  }
}
