import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiAccountAgent } from '../../../../state/bpiAccounts/agents/bpiAccounts.agent';
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

    const newWorkflowCandidate = this.agent.createNewWorkflow(
      command.name,
      workstepsToConnect,
      command.workgroupId,
      newBpiAccountCandidate,
    );

    const results = await this.storageAgent.storeWorkflowTransaction(
      newBpiAccountCandidate,
      newWorkflowCandidate,
    );

    return results;
  }
}
