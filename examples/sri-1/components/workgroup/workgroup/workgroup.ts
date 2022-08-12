import { Workstep } from '../workstep/workstep';
import { BpiSubject } from '../identity/bpiSubject';
import { IWorkgroup } from './workgroup.interface';
import { Workflow } from '../workflow/workflow';
import { Security } from '../policy/security'
import { Privacy } from "../policy/privacy"

export class Workgroup implements IWorkgroup {
    id: string; // TODO: Add uuid after #491
    name: string;
    administrator: BpiSubject[] = []; 
    securityPolicy: Security[] = []; //TODO Implement securityPolicy #485
    privacyPolicy: Privacy[] = []; //TODO Implement privacyPolicy #485
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

    //TODO Implement checks for actions bound by security and privacy policies #485
    addParticipant(bpiSubject: BpiSubject) { 
        return  this.participants.push(bpiSubject);
    };

    addParticipants(bpiSubjects: BpiSubject[]) { 
        bpiSubjects.forEach(subject => {
            this.participants.push(subject);
        });
        return this.participants;
    }

    getParticipantById(id: string): BpiSubject {
        return this.participants.find(subject => subject.id === id);
    };

    getAllParticipants(): BpiSubject[] {
        return this.participants;
    };

    updateParticipant(id: string, ...update:any): BpiSubject {}; //TODO write logic for dynamic update #485

    removeParticipant(id: string): BpiSubject {
        const participant = this.participants.filter(subject => subject.id != id);
        if(!participant.length) {
            throw new Error('No mathcing participant found');
        }
        return this.participants = participant;
    };

    removeParticipants(ids: string[]): BpiSubject[] {
        const participants = this.participants.filter(subject => !ids.includes(subject.id));
        if(!participants.length) {
            throw new Error('No matching participant found');
        }
        return this.participants = participants;
    };

    addSecurityPolicy(securityPolicy: Security) {
        return this.securityPolicy.push(securityPolicy); 
    };

    removeSecurityPolicy(securityPolicy: Security) {
        const secPolicy = this.securityPolicy.filter(policy => policy.id != securityPolicy.id);
        if(!secPolicy.length) {
            throw new Error('No matching security policy');
        }
        return this.securityPolicy = secPolicy;
    };

    updateSecurityPolicy(id: string, ...updates: string[]) {}; //TODO write logic for dynamic update #485

    addPrivacyPolicy(privacyPolicy: Privacy) {
        return this.privacyPolicy.push(privacyPolicy);
    };

    removePrivacyPolicy(privacyPolicy: Privacy) {
        const privPolicy = this.privacyPolicy.filter(policy => policy.id != privacyPolicy.id);
        if(!privPolicy.length) {
            throw new Error('No matching privacy policy');
        }
        this.privacyPolicy = privPolicy;
    };

    updatePrivacyPolicy(id: string, ...updates: string[]) {}; //TODO write logic for dynamic update #485

    addWorkstep(workstep: Workstep) {
        return this.worksteps.push(workstep);
    };

    getWorkstepById(workstepId: string) {
        return this.worksteps.find(step => step.id === workstepId);
    };

    addWorkflow(workflow: Workflow) {
        return this.workflows.push(workflow);
    };

    getWorkflowById(workflowId: string) {
        return this.workflows.find(workflow => workflow.id === workflowId);
    };
}