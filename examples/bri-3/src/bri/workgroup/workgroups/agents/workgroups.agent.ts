import { Injectable, NotFoundException } from '@nestjs/common';
import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { Workflow } from '../../workflows/models/workflow';
import { Workstep } from '../../worksteps/models/workstep';

import { uuid } from 'uuidv4';
import { Workgroup } from '../models/workgroup';
import { BpiSubjectStorageAgent } from 'src/bri/identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { WorkstepStorageAgent } from '../../worksteps/agents/workstepsStorage.agent';
import { WorkflowStorageAgent } from '../../workflows/agents/workflowsStorage.agent';
import { WorkgroupStorageAgent } from './workgroupStorage.agent';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';

// Agent methods have extremely declarative names and perform a single task
@Injectable()
export class WorkgroupAgent {
  constructor(
    private workgroupStorageAgent: WorkgroupStorageAgent,
    private bpiSubjectStorageAgent: BpiSubjectStorageAgent,
    private workstepStorageAgent: WorkstepStorageAgent,
    private workflowStorageAgent: WorkflowStorageAgent,
  ) {}

  public async fetchWorkgroupAdministratorsAndThrowIfNoneExist(
    administrstorIds: string[],
  ): Promise<BpiSubject[]> {
    const bpiSubjects = await this.bpiSubjectStorageAgent.getBpiSubjectsById(
      administrstorIds,
    );

    if (Array.isArray(bpiSubjects) && !bpiSubjects.length) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiSubjects;
  }

  public async fetchWorkgroupParticipantsAndThrowIfNoneExist(
    participantIds: string[],
  ): Promise<BpiSubject[]> {
    const bpiSubjects = await this.bpiSubjectStorageAgent.getBpiSubjectsById(
      participantIds,
    );

    if (Array.isArray(bpiSubjects) && !bpiSubjects.length) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiSubjects;
  }

  public async fetchWorkstepCandidatesAndThrowIfNoneExist(
    workstepIds: string[],
  ): Promise<Workstep[]> {
    const worksteps = await this.workstepStorageAgent.getMatchingWorkstepsById(
      workstepIds,
    );

    if (Array.isArray(worksteps) && !worksteps.length) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return worksteps;
  }

  public async fetchWorkflowCandidatesAndThrowIfNoneExist(
    workflowIds: string[],
  ): Promise<Workflow[]> {
    const workflows = await this.workflowStorageAgent.getWorkflowsById(
      workflowIds,
    );

    if (Array.isArray(workflows) && !workflows.length) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return workflows;
  }

  public createNewWorkgroup(
    name: string,
    administrator: BpiSubject[],
    securityPolicy: string,
    privacyPolicy: string,
    participants: BpiSubject[],
    worksteps: Workstep[],
    workflows: Workflow[],
  ): Workgroup {
    return new Workgroup(
      uuid(),
      name,
      administrator,
      securityPolicy,
      privacyPolicy,
      // participants,
      // worksteps,
      workflows,
    );
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(
    id: string,
  ): Promise<Workgroup> {
    const workgroupToUpdate = await this.workgroupStorageAgent.getWorkgroupById(
      id,
    );

    if (!workgroupToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return workgroupToUpdate;
  }

  public updateWorkgroup(
    workgroupToUpdate: Workgroup,
    name: string,
    administrator: BpiSubject[],
    securityPolicy: string,
    privacyPolicy: string,
    participants: BpiSubject[],
    worksteps: Workstep[],
    workflows: Workflow[],
  ) {
    workgroupToUpdate.updateName(name);
    workgroupToUpdate.updateAdministrators(administrator);
    workgroupToUpdate.updateSecurityPolicy(securityPolicy);
    workgroupToUpdate.updatePrivacyPolicy(privacyPolicy);
    workgroupToUpdate.updateParticipants(participants);
    workgroupToUpdate.updateWorksteps(worksteps);
    workgroupToUpdate.updateWorkflows(workflows);
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(
    id: string,
  ): Promise<Workgroup> {
    const workgroupToDelete = await this.workgroupStorageAgent.getWorkgroupById(
      id,
    );

    if (!workgroupToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return workgroupToDelete;
  }
}
