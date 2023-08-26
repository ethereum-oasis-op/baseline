import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { WorkstepExecutionFailuresEvent } from './workstepExecutionFailures.event';
import { LoggingService } from '../../../../shared/logging/logging.service';
import { BpiMessage } from '../../../communication/models/bpiMessage';
import { BpiMessageType } from '../../../communication/models/bpiMessageType.enum';
import { MessagingAgent } from '../../../communication/agents/messaging.agent';

@EventsHandler(WorkstepExecutionFailuresEvent)
export class WorkstepExecutionFailuresHandler
  implements IEventHandler<WorkstepExecutionFailuresEvent>
{
  constructor(
    private readonly logger: LoggingService,
    private readonly messagingAgent: MessagingAgent,
  ) {}

  handle(event: WorkstepExecutionFailuresEvent) {
    let message: string, messageType: number;

    if (event.err !== 'Success') {
      message = `Failed execution of transaction with id ${event.tx.id}. Error: ${event.err}`;
      messageType = BpiMessageType.Err;

      this.logger.logError(message);
    } else {
      message = `Transaction ${event.tx.toBpiSubjectAccountId} from ${event.tx.fromBpiSubjectAccountId} successfully executed`;
      messageType = BpiMessageType.Info;

      this.logger.logInfo(message);
    }

    const errPayload = this.constructPayload(message);

    const errorBpiMessage = new BpiMessage(
      event.tx.id,
      event.tx.fromBpiSubjectAccountId,
      event.tx.toBpiSubjectAccountId,
      JSON.stringify(errPayload),
      event.tx.signature,
      messageType,
    );

    const channels = [event.tx.fromBpiSubjectAccount.ownerBpiSubject.publicKey];

    if (event.err == 'Success') {
      channels.push(event.tx.toBpiSubjectAccount.ownerBpiSubject.publicKey);
    }

    this.publishMessage(channels, errorBpiMessage);
  }

  private constructPayload(message: string) {
    return {
      id: 'xxx',
      errorMessage: message,
    };
  }

  private async publishMessage(channels: string[], bpiMessage: BpiMessage) {
    await Promise.all(
      channels.map(async (channel) => {
        await this.messagingAgent.publishMessage(
          channel,
          JSON.stringify(bpiMessage),
        );
      }),
    );
  }
}
