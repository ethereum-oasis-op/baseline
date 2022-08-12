import { Workstep } from '../workstep/workstep';
import { Workgroup } from './workgroup';
import { BpiSubject } from '../identity/bpiSubject';
import { Agreement } from '../storage/agreement';
import { Invitation } from '../invitation/invitation';
import { Security } from '../policy/security';
import { Privacy } from '../policy/privacy';

export interface IWorkgroupComponent {

    workgroups: Workgroup[];
    invitations: Invitation[];
    archivedWorkgroups: Workgroup[];
    getWorkgroups(): Workgroup[];
    createWorkgroup(workgroup: Workgroup): Workgroup;
    getWorkgroupById(id: string): Workgroup
    sendInviteToWorkgroup(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string, agreement: Agreement): Invitation;
    getInvitationById(id: string): Invitation;
    getReceivedInvitationsByEmail(email: string): Invitation[];
    acceptWorkgroupInvitation(id: string, name: string, recipient: string, workGroupId: string) : {acceptanceStatus: string};
    updateWorkgroup(id: string, ...updates: string[] ): Workgroup;
    deleteWorkgroup(id: string): Workgroup[];
    archiveWorkgroup(id: string): Workgroup | string;
}