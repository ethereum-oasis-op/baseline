import { Agreement } from '../storage/agreement';
import { BpiSubject } from '../identity/bpiSubject';
import { Invitation } from '../invitation/invitation';
import { Workgroup } from './workgroup';
import { Workstep } from '../workstep/workstep';
import { IWorkgroupComponent } from './workgroupComponent.interface';
import { Security } from '../policy/security';
import { Privacy } from '../policy/privacy';

export class WorkgroupComponent implements IWorkgroupComponent {
    workgroups: Workgroup[] = [];
    invitations: Invitation[] = [];
    archivedWorkgroups: Workgroup[] = [];
    
    //TODO Implement checks for actions bound by security and privacy policies #485
    getWorkgroups(): Workgroup[] { 
        return this.workgroups;
    };

    createWorkgroup(name: string, id: string, owner: BpiSubject, worksteps: Workstep[], securityPolicy: Security, privacyPolicy: Privacy): Workgroup {
        const workgroup = new Workgroup(name, id, owner, worksteps, securityPolicy, privacyPolicy); //TODO Authorize BPI subject to create workgroup #485
        this.workgroups.push(workgroup);
        return workgroup;
    };

    getWorkgroupById(id: string): Workgroup  {
        const workgroup = this.workgroups.find(workgroup => workgroup.id == id);
        if (!workgroup) {
            throw new Error('Workgroup Does Not Exist');
        }
        return workgroup;
    }; 

    updateWorkgroup(id: string, ...updates: string[]): Workgroup {}; //TODO write logic for dynamic update #485

    deleteWorkgroup(id: string): Workgroup[] {
        this.workgroups = this.workgroups.filter(workgroup => workgroup.id != id);
        return this.workgroups;
    }
    archiveWorkgroup(id: string): Workgroup | string {
        const workgroup = this.workgroups.find(group => group.id == id);
        if (!workgroup) {
            throw new Error('Workgroup Does Not Exist');
        }
        this.workgroups = this.workgroups.filter(group => group.id !== id)
        this.archivedWorkgroups.push(workgroup)
        return workgroup;
    }

    //TODO create invitation functionality #485
    sendInviteToWorkgroup(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string, agreement: Agreement): Invitation {}; 

    getReceivedInvitationsByEmail(email: string): Invitation[] {};

    getInvitationById(id: string): Invitation {};

    acceptWorkgroupInvitation(id: string, name: string, recipient: string, workgroupId: string) : {acceptanceStatus: string} {};
}
