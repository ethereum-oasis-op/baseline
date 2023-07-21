import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkflowAgent } from '../../agents/workflows.agent';
import { WorkflowStorageAgent } from '../../agents/workflowsStorage.agent';
import { CreateWorkflowCommand } from './createWorkflow.command';
import { BpiAccountAgent } from 'src/bri/identity/bpiAccounts/agents/bpiAccounts.agent';
import { BpiAccountStorageAgent } from 'src/bri/identity/bpiAccounts/agents/bpiAccountsStorage.agent';
import { WorkgroupStorageAgent } from 'src/bri/workgroup/workgroups/agents/workgroupStorage.agent';

@CommandHandler(CreateWorkflowCommand)
export class CreateWorkflowCommandHandler
  implements ICommandHandler<CreateWorkflowCommand>
{
  constructor(
    private agent: WorkflowAgent,
    private accountAgent: BpiAccountAgent,
    private storageAgent: WorkflowStorageAgent,
    private workgroupStorageAgent: WorkgroupStorageAgent,
    private accountStorageAgent: BpiAccountStorageAgent,
  ) {}

  async execute(command: CreateWorkflowCommand) {
    const workstepsToConnect =
      await this.agent.fetchWorkstepCandidatesForWorkflowAndThrowIfExistenceValidationFails(
        command.workstepIds,
      );

    const workgroup = await this.workgroupStorageAgent.getWorkgroupById(
      command.workgroupId,
    );

    const newBpiAccountCandidate = this.accountAgent.createNewBpiAccount(
      [], // TODO:  workgroup.participants, either get all BpiSubjectAccounts bellonging to participatns or have bpisubjectaccounts ids passed as param
      'sample authorization condition',
      'sample state object prover system',
      'sample state object storage',
    );

    const newBpiAccount = await this.accountStorageAgent.storeNewBpiAccount(
      newBpiAccountCandidate,
    );

    const newWorkflowCandidate = this.agent.createNewWorkflow(
      command.name,
      workstepsToConnect,
      command.workgroupId,
      newBpiAccount,
    );

    const newWorkflow = await this.storageAgent.storeNewWorkflow(
      newWorkflowCandidate,
    );

    return newWorkflow.id;
  }
}
