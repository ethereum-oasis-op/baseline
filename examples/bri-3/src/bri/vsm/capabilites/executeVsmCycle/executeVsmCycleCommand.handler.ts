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

      if (!this.agent.validateTransactionForExecution(tx)) {
        tx.updateStatusToInvalid();
        await this.storageAgent.updateTransactionStatus(tx);
        return;
      }

      try {
        // TODO: Execute the transaction
      } catch (error) {
        this.logger.logError(
          `Error executing transaction with id ${tx.id}: ${error}`,
        );
        tx.updateStatusToAborted();
        this.storageAgent.updateTransactionStatus(tx);
      }

      tx.updateStatusToExecuted();
      this.storageAgent.updateTransactionStatus(tx);
    });

    // TODO: Relevant BPI subjects are informed (Notification is thrown?)
  }
}
