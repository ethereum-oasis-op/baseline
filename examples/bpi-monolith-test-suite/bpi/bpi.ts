import { Agreement } from "./agreement";
import { BpiSubject } from "./bpiSubject";
import { Invitation } from "./invitation";
import { Workgroup } from "./workgroup";
import { Workstep } from "./workstep";

export class BPI {
    owner: BpiSubject;
    organizations: BpiSubject[] = [];
    workgroups: Workgroup[] = [];
    agreement: Agreement = new Agreement;
    invitations: Invitation[] = [];

    constructor(id: string, name: string, productIds: string[]) {
        this.owner = this.addOrganization(id, name);
        this.agreement.productIds = productIds;
    }

    // Used to register a new organization with the BPI and the external registry
    addOrganization(id: string, name: string): BpiSubject {
        const organization = new BpiSubject();
        organization.id = id;
        organization.name = name;

        this.organizations.push(organization);

        return organization;
    }

    // Retrieves the organization/BpiSubject's details 
    getOrganizationById(id: string): BpiSubject {
        const orgs = this.organizations.filter(org => org.id === id);

        return orgs[0];
    }

    addWorkgroup(id: string, name: string, worksteps: Workstep[]): Workgroup {
        const workgroup = new Workgroup(worksteps);

        workgroup.id = id;
        workgroup.name = name;
        workgroup.participants.push(this.owner);
        this.workgroups.push(workgroup);

        return workgroup;
    }
    

    getWorkgroupById(id: string): Workgroup {
        const workgroups = this.workgroups.filter(workgroup => workgroup.id === id);

        return workgroups[0];
    }

    invite(id:string, name:string, sender:BpiSubject, recipient:string, workgroupId: string ,agreement:Agreement):Invitation{
        const inv = new Invitation(id,name,sender,recipient,workgroupId,agreement);
        
        this.invitations.push(inv);
        return inv;
    }

    getInvitationById(id:string):Invitation{
        const filtInv = this.invitations.filter(inv=>inv.id === id)

        return filtInv[0];
    }

    signInvite(invitation: Invitation, id: string, name: string){
        const bob = new BpiSubject();
        bob.id = id;
        bob.name = name;
        
        invitation.agreement.signature = true;
        invitation.agreement.proofs.push(this.createProof(this.agreement));
        this.organizations.push(bob);
        this.getWorkgroupById(invitation.workgroupId).addParticipants(bob);
    }

    createProof(input:any){
        return Math.random().toString(36).substr(2, 20);
    }
}
