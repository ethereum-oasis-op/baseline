import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { BpiMessageAgent } from '../../agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { ProcessInboundBpiMessageCommand } from './processInboundMessage.command';

// Difference between this and the create bpi message command handler is that this does not
// want to stop the execution flow by throwing a nestjs exception which would result in 404 in case of an API call
@CommandHandler(ProcessInboundBpiMessageCommand)
export class ProcessInboundMessageCommandHandler
  implements ICommandHandler<ProcessInboundBpiMessageCommand>
{
  constructor(
    private readonly agent: BpiMessageAgent,
    private readonly storageAgent: BpiMessageStorageAgent,
  ) {}

  async execute(command: ProcessInboundBpiMessageCommand) {
    let dbFromBpiSubject: BpiSubject;
    let dbToBpiSubject: BpiSubject;

    try {
      const { fromBpiSubject, toBpiSubject } =
        await this.agent.getFromAndToSubjectsAndThrowIfNotExist(
          command.from,
          command.to,
        );

      // TODO: Better way to map this
      dbFromBpiSubject = fromBpiSubject;
      dbToBpiSubject = toBpiSubject;
    } catch (e) {
      // TODO: Log and ignore message
      return;
    }

    const newBpiMessageCandidate = this.agent.createNewBpiMessage(
      command.id,
      dbFromBpiSubject,
      dbToBpiSubject,
      command.content,
      command.signature,
      command.type,
    );

    await this.storageAgent.storeNewBpiMessage(newBpiMessageCandidate);
  }
}
