import { Agreement } from '../storage/agreement';
import { BpiSubject } from '../identity/bpiSubject';
import { Invitation } from './invitation';
import { Workgroup } from './workgroup';
import { Workstep } from './workstep';
import { Organization } from "./organization";
import { IWorkgroupComponent } from './workgroupComponent.interface';

export class WorkgroupComponent implements IWorkgroupComponent {
    workgroups: Workgroup[] = [];
    invitations: Invitation[] = [];
    getWorkgroups(): Workgroup[] { 
        return
    };

     //[R236] There MUST be at least one BPI Subject role that has the authorization to create a workgroup. [R237] A workgroup MUST consist of at least one BPI Subject participant.
    createWorkgroup(name: string, id: string, owner: BpiSubject, worksteps: Workstep[]): Workgroup {  
        return
    };
    getWorkgroupById(id: string): Workgroup {
        return 
    }; 
    sendInviteToWorkgroup(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string, agreement: Agreement): Invitation {
        return 
    };
    getReceivedInvitationsByEmail(email: string): Invitation[] {
        return 
    };
    getInvitationById(id: string): Invitation {
        return 
    };

    acceptWorkgroupInvitation(id: string, name: string, recipient: string, workGroupId: string) : {acceptanceStatus: string}{
        return
    };
    updateWorkgroup(): Workgroup {
        return
    };
    getWorkgroupOrganizations(id: string): Organization[] {
        return
    };
    createWorkgroupOrganization(id: string): {workgroup: Workgroup, organization: Organization} {
        return
    };
    updateWorkgroupOrganization(id: string): Workgroup {  //TODO what values should be updated? 
        return
    };
}