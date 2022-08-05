import { Workstep } from '../workstep/workstep';
import { BpiSubject } from '../identity/bpiSubject';
import { IWorkgroup } from './workgroup.interface';
import { Workflow } from '../workflow/workflow';
import { Security } from '../policy/security'
import { Privacy } from "../policy/privacy"

export class Workgroup implements IWorkgroup {
    id: string;
    name: string
    administrator: BpiSubject[] = []; //[R238] A workgroup MUST have at least one administrator.
    securityPolicy: Security[] = []; //[239] A workgroup MUST have at least one security policy. Note that a security policy consists of authentication and authorization rules for the workgroup participants. Note also that one or more workgroup administrators define the workgroup security policy.
    privacyPolicy: Privacy[] = []; //[R240] A workgroup MUST have at least one security policy. A privacy policy consists of the data visibility rules for each participant.
    participants: BpiSubject[] = [];
    worksteps: Workstep[] = [];
    workflows: Workflow[] = [];

    constructor(id: string, name: string, administrators: BpiSubject[], participants: BpiSubject[], securityPolicy: Security, privacyPolicy: Privacy ) {
        this.id = id;
        this.name = name;
        this.administrator.push(administrators);
        this.participants.push(participants);
        this.securityPolicy.push(securityPolicy);
        this.privacyPolicy.push(privacyPolicy);
    }

    addParticipant(bpiSubject: BpiSubject) {
        return  this.participants.push(bpiSubject);
    };

    addParticipants(bpiSubjects: BpiSubject[]) {
        bpiSubjects.forEach(subject => {
            this.participants.push(subject);
        });
    }

    getParticipantById(id: string): BpiSubject {
        return this.participants.find(subject => subject.id == id);
    };

    getAllParticipants(): BpiSubject[] {
        return this.participants;
    };

    updateParticipant(id: string, ...update:any): BpiSubject{
        //TODO write logic for dynamic update
        return null;
    };

    removeParticipant(id: string): BpiSubject{
        return this.participants = this.participants.filter(subject => subject.id != id);
    };

    removeParticipants(ids: string[]): BpiSubject[]{
        return this.participants = this.participants.filter(subject => !ids.includes(subject.id))
    };

    addSecurityPolicy(securityPolicy: Security) {
        return this.securityPolicy.push(securityPolicy);
    };

    removeSecurityPolicy(securityPolicy: Security) {
        return this.securityPolicy = this.securityPolicy.filter(policy => policy.id != securityPolicy.id);
    };

    updateSecurityPolicy(id: string, ...updates: string[]) {
        //TODO write logic for dynamic update
        return null;
    };

    addPrivacyPolicy(privacyPolicy: Privacy) {
        return this.privacyPolicy.push(privacyPolicy);
    };

    removePrivacyPolicy(privacyPolicy: Privacy) {
        this.privacyPolicy = this.privacyPolicy.filter(policy => policy.id != privacyPolicy.id);
    };

    updatePrivacyPolicy(id: string, ...updates: string[]) {
        //TODO write logic for dynamic update
        return null;
    };

    addWorkstep(workstep: Workstep) {
        return this.worksteps.push(workstep);
    };

    getWorkstepById(workstepId: string) {
        return this.worksteps.find(step => step.id == workstepId);
    };

    addWorkflow(workflow: Workflow) {
        return this.workflows.push(workflow);
    };

    getWorkflowById(workflowId: string) {
        return this.workflows.find(workflow => workflow.id == workflowId);
    };
}