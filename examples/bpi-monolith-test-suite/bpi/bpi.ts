import { Agreement } from "./agreement";
import { BpiSubject } from "./bpiSubject";
import { Invitation } from "./invitation";
import { Workgroup } from "./workgroup";
import { Workstep } from "./workstep";
import { BpiMessage } from "./bpiMessage";
import { IMessagingComponent } from "./components/messaging/messaging.interface";
import { IWorkGroupComponent } from "./components/workgroup/workgroup.interface";

export class BPI {
    owner: BpiSubject;
    organizations: BpiSubject[] = [];
    agreement: Agreement = new Agreement;
    messagingComponent: IMessagingComponent;
    workgroupComponent: IWorkGroupComponent;

    constructor(id: string, name: string, productIds: string[], messagingComponent: IMessagingComponent, workgroupComponent: IWorkGroupComponent) {
        this.owner = this.addOrganization(id, name);
        this.agreement.productIds = productIds; // TODO: Move this to initialize agrement state or something similar

        this.messagingComponent = messagingComponent;
        this.workgroupComponent = workgroupComponent;
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

    getWorkgroups(): Workgroup[] {
        return this.workgroupComponent.getWorkgroups();}

    addWorkgroup(name: string, id: string, worksteps: Workstep[]): Workgroup {
        return this.workgroupComponent.createWorkgroup(name, id, this.owner, worksteps);
        
    }

    getWorkgroupById(id: string): Workgroup {
        return this.workgroupComponent.getWorkgroupById(id);
    }
    
    inviteToWorkgroup(id: string, name: string, sender: BpiSubject, recipient: string, workgroupId: string, agreement: Agreement): Invitation {
        return this.workgroupComponent.sendInviteToWorkgroup(id, name, sender, recipient, workgroupId, agreement);
    }

    getReceivedInvitationsByEmail(email: string): Invitation[] {
        return this.workgroupComponent.getReceivedInvitationsByEmail(email);
    }

    getInvitationById(id: string): Invitation {
        return this.workgroupComponent.getInvitationById(id);
    }

    createProof(agreementPreviousState: Agreement, proposedChanges: Agreement, signature: string) {
        return Math.random().toString(36).substr(2, 20);
    }

    signInvitation(invitationId: string, recipientSignature: string, recipientOrgId: string, recipientOrgName: string) {
        const invitation = this.workgroupComponent.getInvitationById(invitationId);

        // TODO: Verify signature from the recipient
        // TODO: What is the state change on agreement acceptance - status?
        const bobsProof = this.createProof(this.agreement, this.agreement, recipientSignature);

        const bobSubject = new BpiSubject();
        bobSubject.id = recipientOrgId;
        bobSubject.name = recipientOrgName;

        this.organizations.push(bobSubject);

        const workgroup = this.workgroupComponent.getWorkgroupById(invitation.workgroupId);
        workgroup.addParticipants(bobSubject);

        this.agreement.proofs.push(bobsProof);
    }

    verifyProof(proof: string): boolean {
        if (proof.length > 0) return true;
        else return false;
    }

    // MESAGGING API

    postMessage(message: BpiMessage): string {
        if (message.type === "INFO") { // Look at [R111] in the standard, seems the type definition is on us. TODO: Move to constants
            this.messagingComponent.sendMessageToCounterParty(message);
            return "";
        } else if (message.type === "STORE") {
            return this.executeWorkstepMessage(message); // TODO: Create transaction out of this message and store in transaction pool for VSM to handle
        }
    }

    getMessages(subject: BpiSubject): BpiMessage[] {
        return this.messagingComponent.getNewvlyReceivedMessages(subject);
    }

    // MESAGGING API END

    executeWorkstepMessage(message: BpiMessage): string { // TODO: Move to VSM component
        // TODO: Poor man's deep copy - change
        const originalAgreementState = JSON.parse(JSON.stringify(this.agreement));

        const workgroup = this.workgroupComponent.getWorkgroupById(message.workgroupId);
        const workstep = workgroup.getWorkstepById(message.workstepId);

        // If succesfull, this changes the agreement state
        const workstepResult = workstep.execute(this.agreement, message.payload);

        if (!workstepResult) {
            return "err: workstep execution failed to satisfy the agreement.";
        }

        // TODO: Should this be in the workstep execution?
        const workstepStateChangeProof = this.createProof(originalAgreementState, this.agreement, message.senderSignature);
        // TODO: Do not change the agreement directly
        this.agreement.proofs.push(workstepStateChangeProof);

        return workstepStateChangeProof;
    }
}
