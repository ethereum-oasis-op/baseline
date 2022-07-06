import { Workstep } from '../workstep';
import { BpiSubject } from '../identity/bpiSubject';
import { IWorkgroup } from './workgroup.interface';

export class Workgroup implements IWorkgroup {
    id: string;
    name: string
    administrator: BpiSubject[] = []; //[R238] A workgroup MUST have at least one administrator.
    securityPolicy: AuthRules[] = []; //[239] A workgroup MUST have at least one security policy. Note that a security policy consists of authentication and authorization rules for the workgroup participants. Note also that one or more workgroup administrators define the workgroup security policy.
    privacyPolicy: DataVisibilityRoles[] = []; //[R240] A workgroup MUST have at least one security policy. A privacy policy consists of the data visibility rules for each participant.
    participants: BpiSubject[] = [];
    worksteps: Workstep[] = [];
    workflow: Workstep[] = [];

    constructor(id: string, name: string, participants: BpiSubject[],  ) {

    }
    addParticipants(bpiSubject: BpiSubject){
        return
    };
    getParticipantById(id: string): BpiSubject{
        return
    };
    getParticipants(): BpiSubject[]{
        return
    };
    updateParticipant(id: string, update:any): BpiSubject{
        return
    };
    removeParticipant(id: string): BpiSubject{
        return
    };
    removeParticipants(ids: string[]): BpiSubject[]{
        return
    };
    addSecurityPolicy() {
        return
    };
    removeSecurityPolicy() {
        return
    };
    updateSecurityPolicy() {
        return
    };
    addPrivacyPolicy() {
        return
    };
    removePrivacyPolicy() {
        return
    };
    updatePrivacyPolicy() {
        return
    };
    addWorkstep(workstep: Workstep) {
        return
    };
    getWorkstepyId(workstepId: string) {
        return
    };
    addWorkflow(...worksteps: Workstep[]) {
        return
    };
    getWorkflowById(workflowId: string) {
        return
    };
}