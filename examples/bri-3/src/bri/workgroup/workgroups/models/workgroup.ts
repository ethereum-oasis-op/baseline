import { Workstep } from '../../worksteps/models/workstep';
import { Workflow } from '../../workflows/models/workflow';
import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';

export class Workgroup {
  id: string; // TODO: Add uuid after #491
  name: string;
  administrators: BpiSubject[];
  securityPolicy: string; //TODO Implement securityPolicy #485
  privacyPolicy: string; //TODO Implement privacyPolicy #485
  participants: BpiSubject[];
  worksteps: Workstep[];
  workflows: Workflow[];

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
    this.id = id;
    this.name = name;
    this.administrators = administrators;
    this.securityPolicy = securityPolicy;
    this.privacyPolicy = privacyPolicy;
    this.participants = participants;
    this.worksteps = worksteps;
    this.workflows = workflows;
  }

  public updateName(newName: string): void {
    this.name = newName;
  }

  public updateAdministrators(newAdministrators: BpiSubject[]): void {
    this.administrators = newAdministrators;
  }

  public updateSecurityPolicy(newSecurityPolicy: string): void {
    this.securityPolicy = newSecurityPolicy;
  }

  public updatePrivacyPolicy(newPrivacyPolicy: string): void {
    this.privacyPolicy = newPrivacyPolicy;
  }

  public updateParticipants(newParticipants: BpiSubject[]): void {
    this.participants = newParticipants;
  }
}
