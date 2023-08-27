import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { WorkstepExecutionEvent } from './workstepExecution.event';
import { LoggingService } from '../../../../shared/logging/logging.service';
import { BpiMessage } from '../../../communication/models/bpiMessage';
import { BpiMessageType } from '../../../communication/models/bpiMessageType.enum';
import { MessagingAgent } from '../../../communication/agents/messaging.agent';

@EventsHandler(WorkstepExecutionEvent)
export class WorkstepExecutionHandler
  implements IEventHandler<WorkstepExecutionEvent>
{
  constructor(
    private readonly logger: LoggingService,
    private readonly messagingAgent: MessagingAgent,
  ) {}

  handle(event: WorkstepExecutionEvent) {
    let message: string, messageType: number;

    if (event.status !== 'Success') {
      message = `Failed execution of transaction with id ${event.tx.id}. Error: ${event.status}`;
      messageType = BpiMessageType.Err;

      this.logger.logError(message);
    } else {
      message = `Transaction ${event.tx.id} from ${event.tx.fromBpiSubjectAccountId} to ${event.tx.toBpiSubjectAccountId} successfully executed`;
      messageType = BpiMessageType.Info;

      this.logger.logInfo(message);
    }

    // Update standardized payload here
    const payload = this.constructPayload(message);

    const bpiMessage = new BpiMessage(
      event.tx.id,
      event.tx.fromBpiSubjectAccountId,
      event.tx.toBpiSubjectAccountId,
      JSON.stringify(payload),
      event.tx.signature,
      messageType,
    );

    // Change channels to publish message here
    const channels = [event.tx.fromBpiSubjectAccount.ownerBpiSubject.publicKey];

    if (event.status == 'Success') {
      channels.push(event.tx.toBpiSubjectAccount.ownerBpiSubject.publicKey);
    }

    this.publishMessage(channels, bpiMessage);
  }

  private constructPayload(message: string) {
    return {
      id: 'xxx',
      info: message,
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
