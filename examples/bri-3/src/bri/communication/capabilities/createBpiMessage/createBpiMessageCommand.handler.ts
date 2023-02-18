import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiMessageAgent } from '../../agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { MessagingAgent } from '../../agents/messaging.agent';
import { BPI_MESSAGE_ALREADY_EXISTS } from '../../api/err.messages';
import { CreateBpiMessageCommand } from './createBpiMessage.command';

@CommandHandler(CreateBpiMessageCommand)
export class CreateBpiMessageCommandHandler
  implements ICommandHandler<CreateBpiMessageCommand>
{
  constructor(
    private readonly agent: BpiMessageAgent,
    private readonly storageAgent: BpiMessageStorageAgent,
    private readonly messagingAgent: MessagingAgent,
  ) {}

  async execute(command: CreateBpiMessageCommand) {
    const existingBpiMessage = await this.storageAgent.getBpiMessageById(
      command.id,
    );

    if (existingBpiMessage) {
      throw new BadRequestException(BPI_MESSAGE_ALREADY_EXISTS);
    }

    const [fromBpiSubject, toBpiSubject] =
      await this.agent.getFromAndToSubjectsAndThrowIfNotExist(
        command.from,
        command.to,
      );

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
    // Will be improved by introducing NATS authz to allow only the recipient Bpi Subject to listen on this channel (#648)
    await this.messagingAgent.publishMessage(
      toBpiSubject.publicKey,
      this.messagingAgent.serializeBpiMessage(newBpiMessage),
    );

    return newBpiMessage.id;
  }
}
