import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { StateAgent } from '../../../state/agents/state.agent';
import { TransactionStorageAgent } from '../../../transactions/agents/transactionStorage.agent';
import { TransactionAgent } from '../../../transactions/agents/transactions.agent';
import { TransactionStatus } from '../../../transactions/models/transactionStatus.enum';
import { WorkflowStorageAgent } from '../../../workgroup/workflows/agents/workflowsStorage.agent';
import { WorkstepStorageAgent } from '../../../workgroup/worksteps/agents/workstepsStorage.agent';
import { ExecuteVsmCycleCommand } from './executeVsmCycle.command';
import { WorkstepExecutedEvent } from '../handleWorkstepEvents/workstepExecuted.event';
import { CcsmStorageAgent } from '../../../ccsm/agents/ccsmStorage.agent';

@CommandHandler(ExecuteVsmCycleCommand)
export class ExecuteVsmCycleCommandHandler
  implements ICommandHandler<ExecuteVsmCycleCommand>
{
  constructor(
    private txAgent: TransactionAgent,
    private stateAgent: StateAgent,
    private workstepStorageAgent: WorkstepStorageAgent,
    private workflowStorageAgent: WorkflowStorageAgent,
    private txStorageAgent: TransactionStorageAgent,
    private ccsmStorageAgent: CcsmStorageAgent,
    private eventBus: EventBus,
  ) {}

  async execute(command: ExecuteVsmCycleCommand) {
    const executionCandidates =
      await this.txStorageAgent.getTopNTransactionsByStatus(
        Number(process.env.VSM_CYCLE_TX_BATCH_SIZE),
        TransactionStatus.Initialized,
      );

    // TODO: When do we update the nonce on the BpiAccount? // Whenever a transaction is initiated
    executionCandidates.forEach(async (tx) => {
      tx.updateStatusToProcessing();
      await this.txStorageAgent.updateTransaction(tx);

      if (!this.txAgent.validateTransactionForExecution(tx)) {
        this.eventBus.publish(
          new WorkstepExecutedEvent(tx, 'Validation Error'),
        );
        tx.updateStatusToInvalid();
        await this.txStorageAgent.updateTransaction(tx);
        return;
      }

      const workstep = await this.workstepStorageAgent.getWorkstepById(
        tx.workstepId,
      );

      const workflow = await this.workflowStorageAgent.getWorkflowById(
        tx.workflowId,
      );

      try {
        const txResult = await this.txAgent.executeTransaction(tx, workstep!);

        const stateTreeRoot = await this.stateAgent.storeNewLeafInStateTree(
          workflow!.bpiAccount,
          txResult.hash,
          txResult.merkelizedPayload,
          txResult.witness,
        );

        await this.stateAgent.storeNewLeafInHistoryTree(
          workflow!.bpiAccount,
          stateTreeRoot,
        );

        await this.ccsmStorageAgent.storeAnchorHashOnCcsm(tx.workstepInstanceId, txResult.hash);

        tx.updateStatusToExecuted();
        this.txStorageAgent.updateTransaction(tx);
      } catch (error) {
        this.eventBus.publish(new WorkstepExecutedEvent(tx, error));
        tx.updateStatusToAborted();
        this.txStorageAgent.updateTransaction(tx);
        return;
      }

      await this.eventBus.publish(new WorkstepExecutedEvent(tx, 'Success'));
    });
  }
}
