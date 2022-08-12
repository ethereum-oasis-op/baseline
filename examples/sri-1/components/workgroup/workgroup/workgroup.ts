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
    securityPolicy: Security; //TODO Implement securityPolicy #485
    privacyPolicy: Privacy; //TODO Implement privacyPolicy #485
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
       throw new Error("not implemented");
    };

    addParticipants(bpiSubjects: BpiSubject[]) { 
        throw new Error("not implemented");
    }

    getParticipantById(id: string): BpiSubject {
        throw new Error("not implemented");
    };

    getAllParticipants(): BpiSubject[] {
        throw new Error("not implemented");
    };

    updateParticipant(id: string, ...update:any): BpiSubject {
        throw new Error("not implemented");
    };

    removeParticipant(id: string): BpiSubject {
        throw new Error("not implemented");
    };

    removeParticipants(ids: string[]): BpiSubject[] {
        throw new Error("not implemented");
    };

    addSecurityPolicy(securityPolicy: Security) {
        throw new Error("not implemented");
    };

    removeSecurityPolicy(securityPolicy: Security) {
        throw new Error("not implemented");
    };

    updateSecurityPolicy(id: string, ...updates: string[]) {
        throw new Error("not implemented");
    };

    addPrivacyPolicy(privacyPolicy: Privacy) {
        throw new Error("not implemented");
    };

    removePrivacyPolicy(privacyPolicy: Privacy) {
        throw new Error("not implemented");
    };

    updatePrivacyPolicy(id: string, ...updates: string[]) {
        throw new Error("not implemented");
    }; 

    addWorkstep(workstep: Workstep) {
        throw new Error("not implemented");
    };

    getWorkstepById(workstepId: string) {
        throw new Error("not implemented");
    };

    addWorkflow(workflow: Workflow) {
        throw new Error("not implemented");
    };

    getWorkflowById(workflowId: string) {
        throw new Error("not implemented");
    };
}