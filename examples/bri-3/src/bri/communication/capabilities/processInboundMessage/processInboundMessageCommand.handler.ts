import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { LoggingService } from 'src/shared/logging/logging.service';
import { BpiMessageAgent } from '../../agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { ProcessInboundBpiMessageCommand } from './processInboundMessage.command';

// Difference between this and the create bpi message command handler is that this one does not
// want to stop the execution flow by throwing a nestjs exception (which results in 404 response in the other handler)
@CommandHandler(ProcessInboundBpiMessageCommand)
export class ProcessInboundMessageCommandHandler
  implements ICommandHandler<ProcessInboundBpiMessageCommand>
{
  constructor(
    private readonly agent: BpiMessageAgent,
    private readonly storageAgent: BpiMessageStorageAgent,
    private readonly logger: LoggingService,
  ) {}

  async execute(command: ProcessInboundBpiMessageCommand) {
    let fromBpiSubject: BpiSubject;
    let toBpiSubject: BpiSubject;

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

    const newBpiMessageCandidate = this.agent.createNewBpiMessage(
      command.id,
      fromBpiSubject,
      toBpiSubject,
      command.content,
      command.signature,
      command.type,
    );

    await this.storageAgent.storeNewBpiMessage(newBpiMessageCandidate);
  }
}
