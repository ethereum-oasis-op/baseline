import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiAccountAgent } from '../../../../identity/bpiAccounts/agents/bpiAccounts.agent';
import { BpiAccountStorageAgent } from '../../../../identity/bpiAccounts/agents/bpiAccountsStorage.agent';
import { BpiSubjectAccountAgent } from '../../../../identity/bpiSubjectAccounts/agents/bpiSubjectAccounts.agent';
import { WorkgroupAgent } from '../../../../workgroup/workgroups/agents/workgroups.agent';
import { WorkflowAgent } from '../../agents/workflows.agent';
import { WorkflowStorageAgent } from '../../agents/workflowsStorage.agent';
import { CreateWorkflowCommand } from './createWorkflow.command';

@CommandHandler(CreateWorkflowCommand)
export class CreateWorkflowCommandHandler
  implements ICommandHandler<CreateWorkflowCommand>
{
  constructor(
    private agent: WorkflowAgent,
    private accountAgent: BpiAccountAgent,
    private subjectAccountAgent: BpiSubjectAccountAgent,
    private workgroupAgent: WorkgroupAgent,
    private storageAgent: WorkflowStorageAgent,
    private accountStorageAgent: BpiAccountStorageAgent,
  ) {}

  async execute(command: CreateWorkflowCommand) {
    const workstepsToConnect =
      await this.agent.fetchWorkstepCandidatesForWorkflowAndThrowIfExistenceValidationFails(
        command.workstepIds,
      );

    const workgroup =
      await this.workgroupAgent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.workgroupId,
      );

    const bpiAccountOwnerCandidates =
      await this.subjectAccountAgent.getBpiSubjectAccountsAndThrowIfNotExist(
        command.workflowBpiAccountSubjectAccountOwnersIds,
      );

    await this.agent.throwIfWorkflowBpiAccountOwnersAreNotWorkgroupParticipants(
      workgroup.participants,
      bpiAccountOwnerCandidates,
    );

    const newBpiAccountCandidate = this.accountAgent.createNewBpiAccount(
      bpiAccountOwnerCandidates,
      'sample authorization condition',
      'sample state object prover system',
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
