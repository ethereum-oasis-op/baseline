import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BpiAccount } from '../../../identity/bpiAccounts/models/bpiAccount';
import { BpiSubjectAccount } from '../../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';
import { WorkstepStorageAgent } from '../../worksteps/agents/workstepsStorage.agent';
import { Workstep } from '../../worksteps/models/workstep';
import {
  BPI_ACCOUNT_OWNERS_NOT_WORKGROUP_PARTICIPANTS,
  WORKFLOW_NOT_FOUND_ERR_MESSAGE,
  WORKSTEP_NOT_FOUND_ERR_MESSAGE,
} from '../api/err.messages';
import { Workflow } from '../models/workflow';
import { WorkflowStorageAgent } from './workflowsStorage.agent';

@Injectable()
export class WorkflowAgent {
  constructor(
    private workflowStorageAgent: WorkflowStorageAgent,
    private workstepStorageAgent: WorkstepStorageAgent,
  ) {}

  public async fetchWorkstepCandidatesForWorkflowAndThrowIfExistenceValidationFails(
    workstepIds: string[],
  ): Promise<Workstep[]> {
    const worksteps = await this.workstepStorageAgent.getMatchingWorkstepsById(
      workstepIds,
    );

    if (Array.isArray(worksteps) && !worksteps.length) {
      throw new NotFoundException(WORKSTEP_NOT_FOUND_ERR_MESSAGE);
    }

    return worksteps;
  }

  public createNewWorkflow(
    name: string,
    worksteps: Workstep[],
    workgroupId: string,
    bpiAccount: BpiAccount,
  ): Workflow {
    return new Workflow(uuidv4(), name, worksteps, workgroupId, bpiAccount);
  }

  public async throwIfWorkflowBpiAccountOwnersAreNotWorkgroupParticipants(
    workgroupParticipants: BpiSubject[],
    bpiAccountOwnerCandidates: BpiSubjectAccount[],
  ): Promise<boolean> {
    bpiAccountOwnerCandidates.forEach((bpiSubjectAccount) => {
      const ownerIndexInListOfParticipants = workgroupParticipants.findIndex(
        (bpiSubject) => {
          bpiSubject.id === bpiSubjectAccount.ownerBpiSubjectId;
        },
      );

      if (ownerIndexInListOfParticipants === -1) {
        throw new BadRequestException(
          BPI_ACCOUNT_OWNERS_NOT_WORKGROUP_PARTICIPANTS,
        );
      }
    });

    return true;
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(
    id: string,
  ): Promise<Workflow> {
    const workflowToUpdate = await this.workflowStorageAgent.getWorkflowById(
      id,
    );

    if (!workflowToUpdate) {
      throw new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE);
    }

    return workflowToUpdate;
  }

  public updateWorkflow(
    workflowToUpdate: Workflow,
    name: string,
    worksteps: Workstep[],
    workgroupId: string,
  ) {
    workflowToUpdate.updateName(name);
    workflowToUpdate.updateWorksteps(worksteps);
    workflowToUpdate.updateWorkgroupId(workgroupId);
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(
    id: string,
  ): Promise<Workflow> {
    const workflowToDelete = await this.workflowStorageAgent.getWorkflowById(
      id,
    );

    if (!workflowToDelete) {
      throw new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE);
    }

    return workflowToDelete;
  }
}
