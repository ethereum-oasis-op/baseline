import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { WorkstepExecutionFailuresEvent } from './workstepExecutionFailures.event';
import { LoggingService } from '../../../../shared/logging/logging.service';

@EventsHandler(WorkstepExecutionFailuresEvent)
export class WorkstepExecutionFailuresHandler
  implements IEventHandler<WorkstepExecutionFailuresEvent>
{
  constructor(private readonly logger: LoggingService) {}

  handle(event: WorkstepExecutionFailuresEvent) {
    this.logger.logError(
      `Invalid transaction for execution with id ${event.id}: ${event.err}`,
    );
  }
}
