import { Workstep } from '../../workstep';
import { BpiSubject } from '../identity/bpiSubject';

export interface IWorkgroup {
    id: string;
    name: string;
    administrator: BpiSubject[]; //[R238] A workgroup MUST have at least one administrator.
    securityPolicy: AuthRules[]; //[239] A workgroup MUST have at least one security policy. Note that a security policy consists of authentication and authorization rules for the workgroup participants. Note also that one or more workgroup administrators define the workgroup security policy.
    privacyPolicy: DataVisibilityRoles[]; //[R240] A workgroup MUST have at least one security policy. A privacy policy consists of the data visibility rules for each participant.
    participants: BpiSubject[];
    worksteps: Workstep[];
    workflow: Workstep[];

    addParticipants(bpiSubject: BpiSubject);
    getParticipantById(id: string): BpiSubject;
    getParticipants(): BpiSubject[];
    updateParticipant(id: string, update:any): BpiSubject;
    removeParticipant(id: string): BpiSubject;
    removeParticipants(ids: string[]): BpiSubject[];
    addSecurityPolicy();
    removeSecurityPolicy();
    updateSecurityPolicy();
    addPrivacyPolicy();
    removePrivacyPolicy();
    updatePrivacyPolicy();    
    addWorkstep(workstep: Workstep);
    getWorkstepyId(workstepId: string);
    addWorkflow(...worksteps: Workstep[]);
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