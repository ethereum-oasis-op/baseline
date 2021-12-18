import { Agreement } from '../storage/agreement';
import { BpiSubject } from '../identity/bpiSubject';
import { Invitation } from './invitation';
import { Workgroup } from './workgroup';
import { Workstep } from './workstep';
import { IWorkGroupComponent } from './workgroup.interface';

export class MockWorkgroupComponent implements IWorkGroupComponent {
    
    workgroups: Workgroup[] = [];
    invitations: Invitation[] = [];

    getWorkgroups(): Workgroup[] { return this.workgroups; }

    createWorkgroup(name: string, id: string, owner: BpiSubject, worksteps: Workstep[]): Workgroup {
        const workgroup = new Workgroup(name, id, owner, worksteps)
        this.workgroups.push(workgroup);
        return workgroup;
    }

    getWorkgroupById(id: string): Workgroup {
        const workgroups = this.workgroups.filter(workgroup => workgroup.id === id);
        return workgroups[0];
    }

    sendInviteToWorkgroup(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string, agreement: Agreement): Invitation {
        const invitation = new Invitation(id, name, sender, recipient, workgroupId, agreement);
        this.invitations.push(invitation);
        return invitation;
    }

    getReceivedInvitationsByEmail(email: string): Invitation[] {
        return this.invitations.filter(inv => inv.recipient === email);
    }

    getInvitationById(id: string): Invitation {
        const filteredInvitations = this.invitations.filter(inv => inv.id === id);
        return filteredInvitations[0];
    }
}