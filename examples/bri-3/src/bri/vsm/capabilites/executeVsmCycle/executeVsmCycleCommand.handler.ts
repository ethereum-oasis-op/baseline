import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoggingService } from '../../../../shared/logging/logging.service';
import { TransactionStorageAgent } from '../../../transactions/agents/transactionStorage.agent';
import { TransactionAgent } from '../../../transactions/agents/transactions.agent';
import { TransactionStatus } from '../../../transactions/models/transactionStatus.enum';
import { WorkstepStorageAgent } from '../../../workgroup/worksteps/agents/workstepsStorage.agent';
import { ExecuteVsmCycleCommand } from './executeVsmCycle.command';

@CommandHandler(ExecuteVsmCycleCommand)
export class ExecuteVsmCycleCommandHandler
  implements ICommandHandler<ExecuteVsmCycleCommand>
{
  constructor(
    private agent: TransactionAgent,
    private workstepStorageAgent: WorkstepStorageAgent,
    private txStorageAgent: TransactionStorageAgent,
    private readonly logger: LoggingService,
  ) {}

  async execute(command: ExecuteVsmCycleCommand) {
    const executionCandidates =
      await this.txStorageAgent.getTopNTransactionsByStatus(
        Number(process.env.VSM_CYCLE_TX_BATCH_SIZE),
        TransactionStatus.Initialized,
      );

    executionCandidates.forEach(async (tx) => {
      tx.updateStatusToProcessing();
      await this.txStorageAgent.updateTransactionStatus(tx);

      if (!this.agent.validateTransactionForExecution(tx)) {
        tx.updateStatusToInvalid();
        await this.txStorageAgent.updateTransactionStatus(tx);
        return;
      }

      const workstep = await this.workstepStorageAgent.getWorkstepById(
        tx.workstepInstanceId,
      );

      try {
        const txResult = this.agent.executeTransaction(tx, workstep);
        // TODO: When do we update the nonce on the BpiAccount?
        // TODO: #702 Update relevant Bpi Account state on sucess
        tx.updateStatusToExecuted();
        this.txStorageAgent.updateTransactionStatus(tx);
      } catch (error) {
        this.logger.logError(
          `Error executing transaction with id ${tx.id}: ${error}`,
        );
        tx.updateStatusToAborted();
        this.txStorageAgent.updateTransactionStatus(tx);
        return;
      }
    });
    // TODO: #705 Relevant BPI subjects are informed (Notification is thrown?)
  }
}
