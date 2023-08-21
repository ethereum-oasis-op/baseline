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
    this.logger.logError(
      `Invalid transaction for execution with id ${event.id}: ${event.err}`,
    );

    const errPayload = {
      errorCode: 'xxx',
      errorMessage: 'Execution fails',
    };

    const errorBpiMessage = new BpiMessage(
      event.id,
      event.fromBpiSubjectAccountId,
      event.toBpiSubjectAccountId,
      JSON.stringify(errPayload),
      event.signature,
      BpiMessageType.Err,
    );

    this.messagingAgent.publishMessage(
      event.initiatorChannel,
      JSON.stringify(errorBpiMessage),
    );
  }
}
