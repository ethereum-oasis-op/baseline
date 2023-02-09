import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
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
    let dbFromBpiSubject: BpiSubject;
    let dbToBpiSubject: BpiSubject;
    
    try {
      const { fromBpiSubject, toBpiSubject } =
        await this.agent.getFromAndToSubjectsAndThrowIfNotExist(
          command.bpiMessage.fromBpiSubjectId,
          command.bpiMessage.toBpiSubjectId,
        );
      
        // TODO: Better way to map this
        dbFromBpiSubject = fromBpiSubject;
        dbToBpiSubject = toBpiSubject;
    } catch (e) {
      // TODO: Log and ignore message
      return;
    }
    

    const newBpiMessageCandidate = this.agent.createNewBpiMessage(
      command.bpiMessage.id,
      dbFromBpiSubject,
      dbToBpiSubject,
      command.bpiMessage.content,
      command.bpiMessage.signature,
      command.bpiMessage.type,
    );

    await this.storageAgent.storeNewBpiMessage(
      newBpiMessageCandidate,
    );
  }
}
