import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExecuteVsmCycleCommand } from './executeVsmCycle.command';
import { TransactionStorageAgent } from 'src/bri/transactions/agents/transactionStorage.agent';
import { LoggingService } from 'src/shared/logging/logging.service';

@CommandHandler(ExecuteVsmCycleCommand)
export class ExecuteVsmCycleCommandHandler
  implements ICommandHandler<ExecuteVsmCycleCommand>
{
  constructor(
    private storageAgent: TransactionStorageAgent,
    private readonly logger: LoggingService,
  ) {}

  async execute(command: ExecuteVsmCycleCommand) {
    this.logger.logInfo('I am in a vsm cycle.');
  }
}
