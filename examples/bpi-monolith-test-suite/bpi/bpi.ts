import { Agreement } from "./agreement";
import { BpiSubject } from "./bpiSubject";
import { Invitation } from "./invitation";
import { Order } from "./order";
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

    inviteToWorkgroup(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string, agreement: Agreement): Invitation {
        const inv = new Invitation(id, name, sender, recipient, workgroupId, agreement);

        this.invitations.push(inv);
        return inv;
    }

    getInvitationById(id: string): Invitation {
        const filteredInvitations = this.invitations.filter(inv => inv.id === id);
        return filteredInvitations[0];
    }

    getReceivedInvitationsByEmail(email: string): Invitation[] {
        return this.invitations.filter(inv => inv.recipient === email);
    }

    createProof(agreementPreviousState: Agreement, signature: string) {
        return Math.random().toString(36).substr(2, 20);
    }

    signInvitation(invitationId: string, recipientSignature: string, recipientOrgId: string, recipientOrgName: string) {
        const invitation = this.getInvitationById(invitationId);

        // TODO: Verify signature from the recipient, this is just a mock
        const bobsProof = this.createProof(this.agreement, recipientSignature); 

        const bobSubject = new BpiSubject();
        bobSubject.id = recipientOrgId;
        bobSubject.name = recipientOrgName;

        this.organizations.push(bobSubject);

        const workgroup = this.getWorkgroupById(invitation.workgroupId);
        workgroup.addParticipants(bobSubject);

        this.agreement.proofs.push(bobsProof);
    }

    verifyProof(proof: string): boolean {
        if (proof.length > 0) return true;
        else return false;
    }

    sendOrder(object: any, workgroupId: string): [boolean, string] {
        //gets workgroup that is chosen to send the object in
        const workgroup = this.getWorkgroupById(workgroupId);
        //executes the workstep of the workgroup
        const objCheck = workgroup.worksteps[0].execute(object)
        //if valid
        if (objCheck) {
            //create some proof and save it
            const proof = this.createProof(object, "TODO: Signature");
            this.agreement.proofs.push(proof);
            //send order and proof to bob.....                              => this should be implemented with workgroup participants logic not hardcoded
            workgroup.getParticipantsById("BO1").orders.push(object);
            workgroup.getParticipantsById("BO1").proofForActualWorkstep = proof;
            //return proof and status to Alice
            return [objCheck, proof];
        }
        //not valid
        else {
            //return error message to Alice
            return [objCheck, "Error: Message"];
        }

    }

    acceptOrder(orderId: string) {
        //this should be implemented with workgroup participants logic not hardcoded....
        this.getOrganizationById("BO1").getOrderById(orderId).acceptanceStatus = "accepted";
        //create some proof and save it
        const proof = this.createProof(this.agreement, "TODO: Signature");                                 // up to discussion 
        this.agreement.proofs.push(proof);
        this.getOrganizationById("BO1").proofForActualWorkstep = proof;

        //sending it all to Alice
        this.getOrganizationById("AL1").getOrderById(orderId).acceptanceStatus = "accepted";
        this.getOrganizationById("AL1").proofForActualWorkstep = proof;
    }
}
