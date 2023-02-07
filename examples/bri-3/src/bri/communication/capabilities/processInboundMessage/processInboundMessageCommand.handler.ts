import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoggingService } from '../../../../shared/logging/logging.service';
import { ProcessInboundBpiMessageCommand } from './processInboundMessage.command';

@CommandHandler(ProcessInboundBpiMessageCommand)
export class ProcessInboundMessageCommandHandler
  implements ICommandHandler<ProcessInboundBpiMessageCommand>
{
  constructor(private readonly log: LoggingService) {}

  async execute(command: ProcessInboundBpiMessageCommand) {
    this.log.logInfo(
      `ProcessInboundMessageCommandHandler: Processing BPI message with id ${command.bpiMessage.id}`,
    );
  }
}
