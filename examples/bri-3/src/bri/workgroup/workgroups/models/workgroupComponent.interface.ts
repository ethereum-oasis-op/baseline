import { Workgroup } from './workgroup';
import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';
import { Agreement } from '../../../storage/models/agreement';
import { Invitation } from '../../invitations/models/invitation';

export interface IWorkgroupComponent {
  workgroups: Workgroup[];
  invitations: Invitation[];
  archivedWorkgroups: Workgroup[];

  getWorkgroups(id?: string[]): Workgroup[];
  createWorkgroup(workgroup: Workgroup): Workgroup;

  sendInviteToWorkgroup(
    invitation: Invitation,
    agreement: Agreement,
  ): Invitation;
  getInvitationById(id: string): Invitation;
  getReceivedInvitationsByEmail(email: string): Invitation[];
  acceptWorkgroupInvitation(
    id: string,
    name: string,
    recipient: string,
    workGroupId: string,
  ): { acceptanceStatus: string };

  updateWorkgroup(id: string, ...updates: string[]): Workgroup;
  deleteWorkgroup(id: string): Workgroup[];
  archiveWorkgroup(id: string): Workgroup | string;
}
