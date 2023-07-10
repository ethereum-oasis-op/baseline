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
    // TODO: Initialized transactions are fetched in batches of configurable size
    // TODO: Fetched transactions are marked as Processing
    // TODO: Transactions are validated and marked as Invalid in case of errors
    // TODO: Valid transactions are passed on to Workstep execution, one by one for now
    // TODO: Dummy workstep outputs are picked up from Workstep execution and transaction is stored as Executed
    // TODO: Any exception during workstep execution is handled gracefully and logged and transaction is marked as Aborted
    // TODO: Relevant BPI subjects are informed (Notification is thrown?)
  }
}
