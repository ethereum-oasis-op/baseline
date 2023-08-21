import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { TransactionStorageAgent } from '../../../transactions/agents/transactionStorage.agent';
import { TransactionAgent } from '../../../transactions/agents/transactions.agent';
import { TransactionStatus } from '../../../transactions/models/transactionStatus.enum';
import { WorkstepStorageAgent } from '../../../workgroup/worksteps/agents/workstepsStorage.agent';
import { ExecuteVsmCycleCommand } from './executeVsmCycle.command';
import { WorkstepExecutionFailuresEvent } from '../handleWorkstepFailuresEvents/workstepExecutionFailures.event';

@CommandHandler(ExecuteVsmCycleCommand)
export class ExecuteVsmCycleCommandHandler
  implements ICommandHandler<ExecuteVsmCycleCommand>
{
  constructor(
    private agent: TransactionAgent,
    private workstepStorageAgent: WorkstepStorageAgent,
    private txStorageAgent: TransactionStorageAgent,
    private eventBus: EventBus,
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
        this.eventBus.publish(
          new WorkstepExecutionFailuresEvent(
            tx.id, 
            'Validation Error', 
            tx.fromBpiSubjectAccountId,
            tx.toBpiSubjectAccountId,
            tx.signature,
            tx.fromBpiSubjectAccount.ownerBpiSubject.publicKey
            )
        );
        tx.updateStatusToAborted();
        this.txStorageAgent.updateTransactionStatus(tx);
        return;
      }

      const workstep = await this.workstepStorageAgent.getWorkstepById(
        tx.workstepInstanceId,
      );

      try {
        const txResult = this.agent.executeTransaction(tx, workstep!);
        // TODO: When do we update the nonce on the BpiAccount?
        // TODO: #702 Update relevant Bpi Account state on sucess
        tx.updateStatusToExecuted();
        this.txStorageAgent.updateTransactionStatus(tx);
      } catch (error) {
        this.eventBus.publish(
          new WorkstepExecutionFailuresEvent(
            tx.id, 
            error, 
            tx.fromBpiSubjectAccountId,
            tx.toBpiSubjectAccountId,
            tx.signature,
            tx.fromBpiSubjectAccount.ownerBpiSubject.publicKey
            )
        );
        tx.updateStatusToAborted();
        this.txStorageAgent.updateTransactionStatus(tx);
        return;
      }
    });
    // TODO: #705 Relevant BPI subjects are informed (Notification is thrown?)
  }
}
