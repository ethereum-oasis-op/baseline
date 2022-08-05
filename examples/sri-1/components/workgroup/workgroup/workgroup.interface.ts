import { Workstep } from '../workstep/workstep';
import { BpiSubject } from ('../identity/bpiSubject';
import { Security } from '../policy/security';
import { Privacy } from '../policy/privacy';
import { Workflow } from '../workflow/workflow';

export interface IWorkgroup {
    id: string;
    name: string;
    administrator: BpiSubject[]; //[R238] A workgroup MUST have at least one administrator.
    securityPolicy: Security[]; //[239] A workgroup MUST have at least one security policy. Note that a security policy consists of authentication and authorization rules for the workgroup participants. Note also that one or more workgroup administrators define the workgroup security policy. //[R236] There MUST be at least one BPI Subject role that has the authorization to create a workgroup.
    privacyPolicy: Privacy[]; //[R240] A workgroup MUST have at least one security policy. A privacy policy consists of the data visibility rules for each participant.
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


/** Extraneous Workgroup Reqs
[R241]
A workgroup administrator MUST be able to perform at minimum the following functions:

add or remove one or more participants
create, update and delete both security and privacy policies.
delete or archive a workgroup
Archiving a workgroup in the context of this document means, that a workgroup cannot be actively used anymore. However, the workgroup data structures and associated data are accessible at any time but only by the participants of the archived workgroup.

[O4]
A workgroup MAY have more than one administrator.

[CR26]>[O4]
There MUST be a consensus model for administrative actions.

[O5]
A workgroup MAY be attached to one or more workstep instances.

[CR27]>[O5]
A workgroup attached to a workflow MUST be also attached to each workstep in the workflow. */