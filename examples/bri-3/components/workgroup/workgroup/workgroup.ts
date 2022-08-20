import { Workstep } from '../workstep/workstep';
import { BpiSubject } from '../../identity/bpiSubject/bpiSubject';
import { IWorkgroup } from './workgroup.interface';
import { Workflow } from '../workflow/workflow';
import { Security } from '../../policy/security'
import { Privacy } from "../../policy/privacy"

export class Workgroup implements IWorkgroup {
    id: string; // TODO: Add uuid after #491
    name: string;
    administrator: BpiSubject[] = []; 
    securityPolicy: Security[]; //TODO Implement securityPolicy #485
    privacyPolicy: Privacy[]; //TODO Implement privacyPolicy #485
    participants: BpiSubject[] = [];
    worksteps: Workstep[] = [];
    workflows: Workflow[] = [];

    constructor(id: string, name: string, administrators: BpiSubject[], participants: BpiSubject[], securityPolicy: Security, privacyPolicy: Privacy ) {
        this.id = id;
        this.name = name;
        this.administrator.push(...administrators);
        this.participants.push(...participants);
        this.securityPolicy.push(securityPolicy);
        this.privacyPolicy.push(privacyPolicy);
    }

    addParticipants(bpiSubject: BpiSubject[]): BpiSubject[] { 
       throw new Error("not implemented");
    };

    getParticipantsById(ids: string[]): BpiSubject[] {
        throw new Error("not implemented");
    };

    getAllParticipants(): BpiSubject[] {
        throw new Error("not implemented");
    };

    updateParticipants(id: string[], update: any[]): BpiSubject[] {
        throw new Error('Method not implemented.');
    }

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

    addWorksteps(worksteps: Workstep[]): Workstep[] {
        throw new Error("not implemented");
    };

    getWorkstepsById(workstepIds: string[]): Workstep[] {
        throw new Error("not implemented");
    };

    addWorkflows(workflows: Workflow[]): Workflow[] {
        throw new Error("not implemented");
    };

    getWorkflowsById(workflowIds: string[]): Workflow[] {
        throw new Error("not implemented");
    };
}