import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
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
    private readonly messagingAgent: MessagingAgent
  ) {}

  async execute(command: CreateBpiMessageCommand) {
    const { fromBpiSubject, toBpiSubject } =
      await this.agent.getFromAndToSubjectsAndThrowIfNotExist(
        command.from,
        command.to,
      );

    const newBpiMessageCandidate = this.agent.createNewBpiMessage(
      command.id,
      fromBpiSubject,
      toBpiSubject,
      command.content,
      command.signature,
      command.type,
    );

    const newBpiMessage = await this.storageAgent.createNewBpiMessage(
      newBpiMessageCandidate,
    );

    // TODO: This is purely for example purposes. Will be expanded on as part of upcoming issues related to messaging.
    await this.messagingAgent.publishMessage("general", newBpiMessage.content);

    return newBpiMessage.id;
  }
}
