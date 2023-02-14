import { Workstep } from '../../worksteps/models/workstep';
import { Workflow } from '../../workflows/models/workflow';
import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';
import { AutoMap } from '@automapper/classes';

export enum WorkgroupStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}
export class Workgroup {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap()
  name: string;

  @AutoMap(() => [BpiSubject])
  administrators: BpiSubject[];

  @AutoMap()
  securityPolicy: string; //TODO Implement securityPolicy #485

  @AutoMap()
  privacyPolicy: string; //TODO Implement privacyPolicy #485

  @AutoMap(() => [BpiSubject])
  participants: BpiSubject[];

  @AutoMap(() => [Workstep])
  worksteps: Workstep[];

  @AutoMap(() => [Workflow])
  workflows: Workflow[];

  @AutoMap()
  status: WorkgroupStatus;

  constructor(
    id: string,
    name: string,
    administrators: BpiSubject[],
    securityPolicy: string,
    privacyPolicy: string,
    participants: BpiSubject[],
    worksteps: Workstep[],
    workflows: Workflow[],
    status: WorkgroupStatus,
  ) {
    this.id = id;
    this.name = name;
    this.administrators = administrators;
    this.securityPolicy = securityPolicy;
    this.privacyPolicy = privacyPolicy;
    this.participants = participants;
    this.worksteps = worksteps;
    this.workflows = workflows;
    this.status = status;
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
