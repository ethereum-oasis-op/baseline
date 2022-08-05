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

    getWorkgroups(): Workgroup[] { 
        return this.workgroups;
    };

     //[R236] There MUST be at least one BPI Subject role that has the authorization to create a workgroup. [R237] A workgroup MUST consist of at least one BPI Subject participant.
    createWorkgroup(name: string, id: string, owner: BpiSubject, worksteps: Workstep[], securityPolicy: Security, privacyPolicy: Privacy): Workgroup {  
        const workgroup = new Workgroup(name, id, owner, worksteps, securityPolicy, privacyPolicy);
        this.workgroups.push(workgroup);
        return workgroup;
    };

    getWorkgroupById(id: string): Workgroup  {
        return this.workgroups.find(workgroup => workgroup.id == id)!; //!Deal with undefined here
    }; 

    updateWorkgroup(id: string, ...updates: string[]): Workgroup {
        //TODO write logic for dynamic update
        return null;
    };

    deleteWorkgroup(id: string): Workgroup[] { //[R241] A workgroup administrator MUST be able to perform at minimum the following functions:
        this.workgroups = this.workgroups.filter(workgroup => workgroup.id != id);
        return this.workgroups;
    }
    archiveWorkgroup(id: string): Workgroup | string { //[R241] A workgroup administrator MUST be able to perform at minimum the following functions:
        const workgroup = this.workgroups.find(group => group.id == id);
        if (!workgroup) {
            return 'Workgroup Not Found';
        }
        this.workgroups = this.workgroups.filter(group => group.id == workgroup.id)
        this.archivedWorkgroups.push(workgroup)
        return workgroup;
    }

    //* actions surrounding sending, retrieving and accepting invitations to workgroups must require verification of identity
    sendInviteToWorkgroup(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string, agreement: Agreement): Invitation {
        //! const invite = MessageComponent.sendInvite(id, name, sender, recipient, workgroupId, agreement);
        //! return  invite;
    };

    getReceivedInvitationsByEmail(email: string): Invitation[] {
        //! const invitations = MessageComponent.retrieveInvitations(email);
        //! return invitations;
    };

    getInvitationById(id: string): Invitation {
        //! return MessageComponent.getInvitationById(id);
    };

    acceptWorkgroupInvitation(id: string, name: string, recipient: string, workgroupId: string) : {acceptanceStatus: string} {
        //! const acceptance = MessageComponent.AcceptWorkgroupInvitation(id, name, recipient, workgroupId);
        //! return acceptance;
    };
}