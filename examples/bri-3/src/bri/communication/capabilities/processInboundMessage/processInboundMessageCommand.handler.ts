import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoggingService } from "src/shared/logging/logging.service";
import { ProcessInboundMessageCommand } from './processInboundMessage.command';

@CommandHandler(ProcessInboundMessageCommand)
export class ProcessInboundMessageCommandHandler
  implements ICommandHandler<ProcessInboundMessageCommand>
{
  constructor(private log: LoggingService) {}

  async execute(command: ProcessInboundMessageCommand) {
    this.log.logInfo(`ProcessInboundMessageCommandHandler: I will be responsible to process this raw message ${command.rawMessage}`)
  }
}
