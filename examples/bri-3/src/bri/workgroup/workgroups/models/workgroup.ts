import { Workstep } from '../../worksteps/models/workstep';
import { IWorkgroup } from './workgroup.interface';
import { Workflow } from '../../workflows/models/workflow';
import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';
import { Security } from '../../../policy/models/security';
import { Privacy } from '../../../policy/models/privacy';

export class Workgroup implements IWorkgroup {
  private _id: string; // TODO: Add uuid after #491
  private _name: string;
  private _administrator: BpiSubject[];
  private _securityPolicy: Security[]; //TODO Implement securityPolicy #485
  private _privacyPolicy: Privacy[]; //TODO Implement privacyPolicy #485
  private _participants: BpiSubject[];
  private _worksteps: Workstep[];
  private _workflows: Workflow[];

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
    this._id = id;
    this._name = name;
    this._administrator = administrator;
    this._securityPolicy = securityPolicy;
    this._privacyPolicy = privacyPolicy;
    this._participants = participants;
    this._worksteps = worksteps;
    this._workflows = workflows;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get administrator(): BpiSubject[] {
    return this._administrator;
  }

  public get securityPolicy(): Security {
    return this._securityPolicy;
  }

  public get privacyPolicy(): Privacy {
    return this._privacyPolicy;
  }

  public get participants(): BpiSubject[] {
    return this._participants;
  }

  public get worksteps(): Workstep[] {
    return this._worksteps;
  }

  public get workflows(): Workflow[] {
    return this._workflows;
  }

  addParticipants(bpiSubject: BpiSubject[]): BpiSubject[] {
    throw new Error('not implemented');
  }

  getParticipants(ids?: string[]): BpiSubject[] {
    throw new Error('not implemented');
  }

  updateParticipants(id: string[], update: any[]): BpiSubject[] {
    throw new Error('Method not implemented.');
  }

  removeParticipants(ids: string[]): BpiSubject[] {
    throw new Error('not implemented');
  }

  addSecurityPolicy(securityPolicy: Security) {
    throw new Error('not implemented');
  }

  removeSecurityPolicy(securityPolicy: Security) {
    throw new Error('not implemented');
  }

  updateSecurityPolicy(id: string, ...updates: string[]) {
    throw new Error('not implemented');
  }

  addPrivacyPolicy(privacyPolicy: Privacy) {
    throw new Error('not implemented');
  }

  removePrivacyPolicy(privacyPolicy: Privacy) {
    throw new Error('not implemented');
  }

  updatePrivacyPolicy(id: string, ...updates: string[]) {
    throw new Error('not implemented');
  }

  addWorksteps(worksteps: Workstep[]): Workstep[] {
    throw new Error('not implemented');
  }

  getWorkstepsById(workstepIds: string[]): Workstep[] {
    throw new Error('not implemented');
  }

  addWorkflows(workflows: Workflow[]): Workflow[] {
    throw new Error('not implemented');
  }

  getWorkflowsById(workflowIds: string[]): Workflow[] {
    throw new Error('not implemented');
  }
}
