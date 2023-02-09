import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiMessageAgent } from '../../agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { ProcessInboundBpiMessageCommand } from './processInboundMessage.command';

@CommandHandler(ProcessInboundBpiMessageCommand)
export class ProcessInboundMessageCommandHandler
  implements ICommandHandler<ProcessInboundBpiMessageCommand>
{
  constructor(
    private readonly agent: BpiMessageAgent,
    private readonly storageAgent: BpiMessageStorageAgent) {}

  async execute(command: ProcessInboundBpiMessageCommand) {
    const { fromBpiSubject, toBpiSubject } =
      await this.agent.getFromAndToSubjectsAndThrowIfNotExist(
        command.bpiMessage.fromBpiSubjectId,
        command.bpiMessage.toBpiSubjectId,
      );

    const newBpiMessageCandidate = this.agent.createNewBpiMessage(
      command.bpiMessage.id,
      fromBpiSubject,
      toBpiSubject,
      command.bpiMessage.content,
      command.bpiMessage.signature,
      command.bpiMessage.type,
    );

    await this.storageAgent.storeNewBpiMessage(
      newBpiMessageCandidate,
    );
  }
}
