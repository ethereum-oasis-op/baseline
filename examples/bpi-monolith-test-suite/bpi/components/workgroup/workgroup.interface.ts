import { Workstep } from '../../workstep';
import { Workgroup } from './workgroup';
import { BpiSubject } from '../identity/bpiSubject';
import { Agreement } from '../storage/agreement';
import { Invitation } from './invitation';


export interface IWorkGroupComponent {
    workgroups: Workgroup[];
    getWorkgroups(): Workgroup[];
    createWorkgroup(name: string, id: string, owner: BpiSubject, worksteps: Workstep[]): Workgroup;
    getWorkgroupById(id: string): Workgroup
    sendInviteToWorkgroup(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string, agreement: Agreement): Invitation;
    getInvitationById(id: string): Invitation;
    getReceivedInvitationsByEmail(email: string): Invitation[];

}