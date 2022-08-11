import { Workstep } from '../workstep/workstep';
import { BpiSubject } from '../identity/bpiSubject';
import { Security } from '../policy/security';
import { Privacy } from '../policy/privacy';
import { Workflow } from '../workflow/workflow';

export interface IWorkgroup {
    id: string;
    name: string;
    administrator: BpiSubject[];
    securityPolicy: Security[];
    privacyPolicy: Privacy[];
    participants: BpiSubject[];
    worksteps: Workstep[];
    workflows: Workflow[];

    addParticipant(bpiSubject: BpiSubject);
    addParticipants(bpiSubjects: BpiSubject[]);
    getParticipantById(id: string): BpiSubject;
    getAllParticipants(): BpiSubject[];
    updateParticipant(id: string, update:any): BpiSubject;
    removeParticipant(id: string): BpiSubject;
    removeParticipants(ids: string[]): BpiSubject[];
    addSecurityPolicy(securityPolicy: Security);
    removeSecurityPolicy(securityPolicy: Security);
    updateSecurityPolicy(id: string, ...udpates: string[]);
    addPrivacyPolicy(privacyPolicy: Privacy);
    removePrivacyPolicy(privacyPolicy: Privacy);
    updatePrivacyPolicy(id: string, ...udpates: string[]);    
    addWorkstep(workstep: Workstep);
    getWorkstepById(workstepId: string);
    addWorkflow(workflow: Workflow);
    getWorkflowById(workflowId: string);
}
