import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { WorkflowStorageAgent } from 'src/bri/workgroup/workflows/agents/workflowsStorage.agent';
import { StateAgent } from '../../../state/agents/state.agent';
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
    private txAgent: TransactionAgent,
    private stateAgent: StateAgent,
    private workstepStorageAgent: WorkstepStorageAgent,
    private workflowStorageAgent: WorkflowStorageAgent,
    private txStorageAgent: TransactionStorageAgent,
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
      await this.txStorageAgent.updateTransactionStatus(tx);

      if (!this.txAgent.validateTransactionForExecution(tx)) {
        this.eventBus.publish(
          new WorkstepExecutionFailuresEvent(tx, 'Validation Error'),
        );
        tx.updateStatusToInvalid();
        await this.txStorageAgent.updateTransactionStatus(tx);
        return;
      }

      const workstep = await this.workstepStorageAgent.getWorkstepById(
        tx.workstepInstanceId,
      );

      const workflow = await this.workflowStorageAgent.getWorkflowById(
        tx.workflowInstanceId,
      );

      try {
        const txResult = await this.txAgent.executeTransaction(tx, workstep!);
        
        await this.stateAgent.storeNewLeafInStateTree(
          workflow!.bpiAccount, 
          "TODO: txResult.hash", 
          txResult.merkelizedPayload, 
          txResult.witness);

    
        tx.updateStatusToExecuted();
        this.txStorageAgent.updateTransactionStatus(tx);
      } catch (error) {
        this.eventBus.publish(new WorkstepExecutionFailuresEvent(tx, error));
        tx.updateStatusToAborted();
        this.txStorageAgent.updateTransactionStatus(tx);
        return;
      }
    });
    // TODO: #705 Relevant BPI subjects are informed (Notification is thrown?)
  }
}
