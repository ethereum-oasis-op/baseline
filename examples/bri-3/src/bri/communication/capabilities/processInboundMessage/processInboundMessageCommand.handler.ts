import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoggingService } from '../../../../shared/logging/logging.service';
import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';
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
    let fromBpiSubject: BpiSubject;
    let toBpiSubject: BpiSubject;

    // TODO: Use an agent method that does not throw in case of invalid from and to
    // but instead returns false
    try {
      [fromBpiSubject, toBpiSubject] =
        await this.agent.getFromAndToSubjectsAndThrowIfNotExist(
          command.from,
          command.to,
        );
    } catch (e) {
      this.logger.logError(
        `ProcessInboundMessageCommandHandler: Exception: ${e} while processing inbound message`,
      );
      return;
    }

    // TODO: Validate the signature and the pk of the sender

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
