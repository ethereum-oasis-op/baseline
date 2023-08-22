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
    const message = `Failed execution of transaction with id ${event.tx.id}. Error: ${event.err}`

    this.logger.logError(
      message,
    );

    const errPayload = {
      errorId: 'xxx',
      errorMessage: message,
    };

    const errorBpiMessage = new BpiMessage(
      event.tx.id,
      event.tx.fromBpiSubjectAccountId,
      event.tx.toBpiSubjectAccountId,
      JSON.stringify(errPayload),
      event.tx.signature,
      BpiMessageType.Err,
    );

    this.messagingAgent.publishMessage(
      event.tx.fromBpiSubjectAccount.ownerBpiSubject.publicKey,
      JSON.stringify(errorBpiMessage),
    );
  }
}
