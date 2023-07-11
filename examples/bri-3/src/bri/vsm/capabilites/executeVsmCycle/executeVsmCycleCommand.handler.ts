import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExecuteVsmCycleCommand } from './executeVsmCycle.command';
import { TransactionStorageAgent } from 'src/bri/transactions/agents/transactionStorage.agent';
import { LoggingService } from 'src/shared/logging/logging.service';
import { TransactionStatus } from 'src/bri/transactions/models/transactionStatus.enum';
import { TransactionAgent } from 'src/bri/transactions/agents/transactions.agent';

@CommandHandler(ExecuteVsmCycleCommand)
export class ExecuteVsmCycleCommandHandler
  implements ICommandHandler<ExecuteVsmCycleCommand>
{
  constructor(
    private agent: TransactionAgent,
    private storageAgent: TransactionStorageAgent,
    private readonly logger: LoggingService,
  ) {}

  async execute(command: ExecuteVsmCycleCommand) {
    this.logger.logInfo('I am in a vsm cycle.');

    // Initialized transactions are fetched in batches of configurable size
    const executionCandidates =
      await this.storageAgent.getTopNTransactionsByStatus(
        Number(process.env.VSM_CYCLE_TX_BATCH_SIZE),
        TransactionStatus.Initialized,
      );

    // Fetched transactions are marked as Processing
    this.agent.bulkUpdateTransactionStatusToProcessing(executionCandidates);

    await this.storageAgent.bulkUpdateTransactionStatus(executionCandidates);

    // TODO: Transactions are validated and marked as Invalid in case of errors
    // TODO: Valid transactions are passed on to Workstep execution, one by one for now
    // TODO: Dummy workstep outputs are picked up from Workstep execution and transaction is stored as Executed
    // TODO: Any exception during workstep execution is handled gracefully and logged and transaction is marked as Aborted
    // TODO: Relevant BPI subjects are informed (Notification is thrown?)
  }
}
