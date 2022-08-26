import { Workstep } from '../../worksteps/models/workstep';
import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';
import { Security } from '../../../policy/models/security';
import { Privacy } from '../../../policy/models/privacy';
import { Workflow } from '../../workflows/models/workflow';

export interface IWorkgroup {
    id: string; // TODO: Add uuid after #491
    name: string;
    administrator: BpiSubject[];
    securityPolicy: Security;
    privacyPolicy: Privacy;
    participants: BpiSubject[];
    worksteps: Workstep[];
    workflows: Workflow[];

    addParticipants(bpiSubjects: BpiSubject[]): BpiSubject[];
    getParticipantsById(ids: string[]): BpiSubject[];
    getAllParticipants(): BpiSubject[];
    updateParticipants(id: string[], update:any[]): BpiSubject[];
    removeParticipants(ids: string[]): BpiSubject[];
    addSecurityPolicy(securityPolicy: Security);
    removeSecurityPolicy(securityPolicy: Security);
    updateSecurityPolicy(id: string, ...udpates: string[]);
    addPrivacyPolicy(privacyPolicy: Privacy);
    removePrivacyPolicy(privacyPolicy: Privacy);
    updatePrivacyPolicy(id: string, ...udpates: string[]);    
    addWorksteps(worksteps: Workstep[]): Workstep[];
    getWorkstepsById(workstepIds: string[]): Workstep[];
    addWorkflows(workflows: Workflow[]): Workflow[];
    getWorkflowsById(workflowIds: string[]): Workflow[];
}
