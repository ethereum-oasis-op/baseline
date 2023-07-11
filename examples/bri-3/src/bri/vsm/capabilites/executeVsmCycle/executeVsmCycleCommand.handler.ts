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
    const executionCandidates =
      await this.storageAgent.getTopNTransactionsByStatus(
        Number(process.env.VSM_CYCLE_TX_BATCH_SIZE),
        TransactionStatus.Initialized,
      );

    executionCandidates.forEach(async (tx) => {
      tx.updateStatusToProcessing();
      await this.storageAgent.updateTransactionStatus(tx);
      //  this.agent.validateTransactionForExecution
      //  if err
      //     this.agent.markTransactionAsAborted
      //     this.storageAgent.updateTransactionStatus
      //     continue
      //  else
      //     execute transaction
      //     this.agent.markTransactionAsExecuted
      //     this.storageAgent.updateTransactionStatus
      //
    });

    // TODO: Any exception during workstep execution is handled gracefully and logged and transaction is marked as Aborted
    // TODO: Relevant BPI subjects are informed (Notification is thrown?)
  }
}
