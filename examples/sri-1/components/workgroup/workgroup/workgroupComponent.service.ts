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

    getWorkgroups(): Workgroup[] { 
        return this.workgroups;
    };

     //[R236] There MUST be at least one BPI Subject role that has the authorization to create a workgroup. [R237] A workgroup MUST consist of at least one BPI Subject participant.
    createWorkgroup(name: string, id: string, owner: BpiSubject, worksteps: Workstep[], securityPolicy: Security, privacyPolicy: Privacy): Workgroup {  
        const workgroup = new Workgroup(name, id, owner, worksteps, securityPolicy, privacyPolicy);
        this.workgroups.push(workgroup);
        return workgroup ;
    };

    getWorkgroupById(id: string): Workgroup  {
        return this.workgroups.find(workgroup => workgroup.id == id)!; //!Deal with undefined here
    }; 

    sendInviteToWorkgroup(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string, agreement: Agreement): Invitation {
        return  //!REQUIRES MESSAGING COMPONENT
    };

    getReceivedInvitationsByEmail(email: string): Invitation[] {
        return //! REQUIRES MESSAGING COMPONENT
    };

    getInvitationById(id: string): Invitation {
        return //! REquires MESSAGING COMPONENT
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