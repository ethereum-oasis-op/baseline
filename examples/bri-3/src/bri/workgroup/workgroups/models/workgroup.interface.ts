import { Workstep } from '../../worksteps/models/workstep';
import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';
import { Security } from '../../../policy/models/security';
import { Privacy } from '../../../policy/models/privacy';
import { Workflow } from '../../workflows/models/workflow';

export interface IWorkgroup {
  addParticipants(): BpiSubject[];
  getParticipants(ids?: string[]): BpiSubject[];
  updateParticipants(id: string[], update: any[]): BpiSubject[];
  removeParticipants(ids: string[]): BpiSubject[];

  addSecurityPolicy(securityPolicy: Security);
  removeSecurityPolicy(securityPolicy: Security);
  updateSecurityPolicy(id: string, ...updates: string[]);

  addPrivacyPolicy(privacyPolicy: Privacy);
  removePrivacyPolicy(privacyPolicy: Privacy);
  updatePrivacyPolicy(id: string, ...updates: string[]);

  addWorksteps(worksteps: Workstep[]): Workstep[];
  getWorkstepsById(workstepIds: string[]): Workstep[];

  addWorkflows(workflows: Workflow[]): Workflow[];
  getWorkflowsById(workflowIds: string[]): Workflow[];
}
