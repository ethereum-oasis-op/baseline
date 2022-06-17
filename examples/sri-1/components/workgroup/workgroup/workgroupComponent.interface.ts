import { Workstep } from '../../workstep';
import { Workgroup } from './workgroup';
import { BpiSubject } from '../identity/bpiSubject';
import { Agreement } from '../storage/agreement';
import { Invitation } from './invitation';
import { Organization } from "./organization"

export interface IWorkgroupComponent {
    getWorkgroups(): Workgroup[];
    createWorkgroup(name: string, id: string, owner: BpiSubject, worksteps: Workstep[]): Workgroup;  //[R236] There MUST be at least one BPI Subject role that has the authorization to create a workgroup. [R237] A workgroup MUST consist of at least one BPI Subject participant.
    getWorkgroupById(id: string): Workgroup
    sendInviteToWorkgroup(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string, agreement: Agreement): Invitation;
    getInvitationById(id: string): Invitation;
    getReceivedInvitationsByEmail(email: string): Invitation[];
    acceptWorkgroupInvitation(id: string, name: string, recipient: string, workGroupId: string) : {acceptanceStatus: string};
    updateWorkgroup(id: string, ): Workgroup; //TODO what values should be updated? 
    getWorkgroupOrganizations(id: string): Organization[];
    createWorkgroupOrganization(id: string): {workgroup: Workgroup, organization: Organization};
    updateWorkgroupOrganization(id: string): Organization;
}