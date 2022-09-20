import { Workstep } from '../../worksteps/models/workstep';
import { IWorkgroup } from './workgroup.interface';
import { Workflow } from '../../workflows/models/workflow';
import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';
import { Security } from '../../../policy/models/security';
import { Privacy } from '../../../policy/models/privacy';

export class Workgroup implements IWorkgroup {
  private id: string; // TODO: Add uuid after #491
  private name: string;
  private administrator: BpiSubject[];
  private securityPolicy: Security[]; //TODO Implement securityPolicy #485
  private privacyPolicy: Privacy[]; //TODO Implement privacyPolicy #485
  private participants: BpiSubject[];
  private worksteps: Workstep[];
  private workflows: Workflow[];

  constructor(
    id: string,
    name: string,
    administrator: BpiSubject[],
    securityPolicy: Security[],
    privacyPolicy: Privacy[],
    participants: BpiSubject[],
    worksteps: Workstep[],
    workflows: Workflow[],
  ) {
    this.id = id;
    this.name = name;
    this.administrator = administrator;
    this.securityPolicy = securityPolicy;
    this.privacyPolicy = privacyPolicy;
    this.participants = participants;
    this.worksteps = worksteps;
    this.workflows = workflows;
  }

  addParticipants(): BpiSubject[] {
    throw new Error('not implemented');
  }

  getParticipants(): BpiSubject[] {
    throw new Error('not implemented');
  }

  updateParticipants(): BpiSubject[] {
    throw new Error('Method not implemented.');
  }

  removeParticipants(): BpiSubject[] {
    throw new Error('not implemented');
  }

  addSecurityPolicy() {
    throw new Error('not implemented');
  }

  removeSecurityPolicy() {
    throw new Error('not implemented');
  }

  updateSecurityPolicy() {
    throw new Error('not implemented');
  }

  addPrivacyPolicy() {
    throw new Error('not implemented');
  }

  removePrivacyPolicy() {
    throw new Error('not implemented');
  }

  updatePrivacyPolicy() {
    throw new Error('not implemented');
  }

  addWorksteps(): Workstep[] {
    throw new Error('not implemented');
  }

  getWorkstepsById(): Workstep[] {
    throw new Error('not implemented');
  }

  addWorkflows(): Workflow[] {
    throw new Error('not implemented');
  }

  getWorkflowsById(): Workflow[] {
    throw new Error('not implemented');
  }
}
