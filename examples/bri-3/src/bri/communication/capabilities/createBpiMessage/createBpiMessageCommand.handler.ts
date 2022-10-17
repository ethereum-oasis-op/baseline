import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiMessageAgent } from '../../agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { CreateBpiMessageCommand } from './createBpiMessage.command';

@CommandHandler(CreateBpiMessageCommand)
export class CreateBpiMessageCommandHandler
  implements ICommandHandler<CreateBpiMessageCommand>
{
  constructor(
    private readonly agent: BpiMessageAgent,
    private readonly storageAgent: BpiMessageStorageAgent,
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

    const newBpiSubject = await this.storageAgent.createNewBpiMessage(
      newBpiMessageCandidate,
    );

    return newBpiSubject.id;
  }
}
