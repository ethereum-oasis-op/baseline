import { Workgroup } from './workgroup';
import { BpiSubject } from '../../identity/bpiSubject/bpiSubject';
import { Agreement } from '../../storage/agreement';
import { Invitation } from '../invitation/invitation';

export interface IWorkgroupComponent {
    workgroups: Workgroup[];
    invitations: Invitation[];
    archivedWorkgroups: Workgroup[];
    getWorkgroups(): Workgroup[];
    createWorkgroup(workgroup: Workgroup): Workgroup;
    getWorkgroupsById(id: string[]): Workgroup[];
    sendInviteToWorkgroup(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string, agreement: Agreement): Invitation;
    getInvitationById(id: string): Invitation;
    getReceivedInvitationsByEmail(email: string): Invitation[];
    acceptWorkgroupInvitation(id: string, name: string, recipient: string, workGroupId: string) : {acceptanceStatus: string};
    updateWorkgroup(id: string, ...updates: string[] ): Workgroup;
    deleteWorkgroup(id: string): Workgroup[];
    archiveWorkgroup(id: string): Workgroup | string;
}