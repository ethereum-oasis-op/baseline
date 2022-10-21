import { Injectable, NotFoundException } from '@nestjs/common';
import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { Workflow } from '../../workflows/models/workflow';
import { Workstep } from '../../worksteps/models/workstep';

import { uuid } from 'uuidv4';
import { Workgroup } from '../models/workgroup';
import { BpiSubjectStorageAgent } from '../../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { WorkgroupStorageAgent } from './workgroupStorage.agent';
import {
  BPISUBJECT_NOT_FOUND_ERR_MESSAGE,
  WORKGROUP_NOT_FOUND_ERR_MESSAGE,
} from '../api/err.messages';

// Agent methods have extremely declarative names and perform a single task
@Injectable()
export class WorkgroupAgent {
  constructor(
    private workgroupStorageAgent: WorkgroupStorageAgent,
    private bpiSubjectStorageAgent: BpiSubjectStorageAgent,
  ) {}

  public async fetchWorkgroupAdministratorsAndThrowIfNoneExist(
    administrstorIds: string[],
  ): Promise<BpiSubject[]> {
    const bpiSubjects = await this.bpiSubjectStorageAgent.getBpiSubjectsById(
      administrstorIds,
    );

    if (Array.isArray(bpiSubjects) && !bpiSubjects.length) {
      throw new NotFoundException(BPISUBJECT_NOT_FOUND_ERR_MESSAGE);
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
      throw new NotFoundException(BPISUBJECT_NOT_FOUND_ERR_MESSAGE);
    }

    return bpiSubjects;
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
      participants,
      worksteps,
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
      throw new NotFoundException(WORKGROUP_NOT_FOUND_ERR_MESSAGE);
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
  ) {
    workgroupToUpdate.updateName(name);
    workgroupToUpdate.updateAdministrators(administrator);
    workgroupToUpdate.updateSecurityPolicy(securityPolicy);
    workgroupToUpdate.updatePrivacyPolicy(privacyPolicy);
    workgroupToUpdate.updateParticipants(participants);
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(
    id: string,
  ): Promise<Workgroup> {
    const workgroupToDelete = await this.workgroupStorageAgent.getWorkgroupById(
      id,
    );

    if (!workgroupToDelete) {
      throw new NotFoundException(WORKGROUP_NOT_FOUND_ERR_MESSAGE);
    }

    return workgroupToDelete;
  }
}
