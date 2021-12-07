import { Agreement } from "./agreement";
import { BpiSubject } from "./bpiSubject";
import { Invitation } from "./invitation";
import { Workgroup } from "./workgroup";
import { Workstep } from "./workstep";
import { BpiMessage } from "./bpiMessage";

export class BPI {
    owner: BpiSubject;
    organizations: BpiSubject[] = [];
    workgroups: Workgroup[] = [];
    agreement: Agreement = new Agreement;
    invitations: Invitation[] = [];
    messages: BpiMessage[] = [];

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

    createProof(agreementPreviousState: Agreement, proposedChanges: Agreement, signature: string) {
        return Math.random().toString(36).substr(2, 20);
    }

    signInvitation(invitationId: string, recipientSignature: string, recipientOrgId: string, recipientOrgName: string) {
        const invitation = this.getInvitationById(invitationId);

        // TODO: Verify signature from the recipient
        // TODO: What is the state change on agreement acceptance - status?
        const bobsProof = this.createProof(this.agreement, this.agreement, recipientSignature); 

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

    sendWorkstepMessage(message: BpiMessage): string {
        // TODO: Poor man's deep copy - change
        const originalAgreementState = JSON.parse(JSON.stringify(this.agreement));

        const workgroup = this.getWorkgroupById(message.workgroupId);
        const workstep = workgroup.getWorkstepById(message.type);

        // If succesfull, this changes the agreement state
        const workstepResult = workstep.execute(this.agreement, message.payload);

        if (!workstepResult) {
            return "err: workstep execution failed to satisfy the agreement.";
        }
        
        // TODO: Should this be in the workstep execution
        const workstepStateChangeProof = this.createProof(originalAgreementState, this.agreement, message.senderSignature);
        // TODO: Do not change the agreement directly
        this.agreement.proofs.push(workstepStateChangeProof);

        return workstepStateChangeProof;
    }

    sendMessageToCounterParty(message: BpiMessage): void {
        // TODO: Messaging capability
        this.messages.push(message);
    }

    getNewvlyReceivedMessages(subject: BpiSubject): BpiMessage[] {
        return this.messages.filter(msg => msg.receiver.id == subject.id);
    }
}
