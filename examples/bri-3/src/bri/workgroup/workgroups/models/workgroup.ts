import { Workstep } from '../../worksteps/models/workstep';
import { Workflow } from '../../workflows/models/workflow';
import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';

export class Workgroup {
  private _id: string; // TODO: Add uuid after #491
  private _name: string;
  private _administrators: BpiSubject[];
  private _securityPolicy: string; //TODO Implement securityPolicy #485
  private _privacyPolicy: string; //TODO Implement privacyPolicy #485
  private _participants: BpiSubject[];
  private _worksteps: Workstep[];
  private _workflows: Workflow[];

  constructor(
    id: string,
    name: string,
    administrators: BpiSubject[],
    securityPolicy: string,
    privacyPolicy: string,
    participants: BpiSubject[],
    worksteps: Workstep[],
    workflows: Workflow[],
  ) {
    this._id = id;
    this._name = name;
    this._administrators = administrators;
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
    return this._administrators;
  }

  public get securityPolicy(): string {
    return this._securityPolicy;
  }

  public get privacyPolicy(): string {
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

  public updateName(newName: string): void {
    this._name = newName;
  }

  public updateAdministrators(newAdministrators: BpiSubject[]): void {
    this._administrators = newAdministrators;
  }

  public updateSecurityPolicy(newSecurityPolicy: string): void {
    this._securityPolicy = newSecurityPolicy;
  }

  public updatePrivacyPolicy(newPrivacyPolicy: string): void {
    this._privacyPolicy = newPrivacyPolicy;
  }

  public updateParticipants(newParticipants: BpiSubject[]): void {
    this._participants = newParticipants;
  }
}
