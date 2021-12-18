import { Agreement } from "./agreement";
import { BpiSubject } from "./bpiSubject";
import { Invitation } from "./invitation";
import { Workgroup } from "./workgroup";
import { Workstep } from "./workstep";
import { BpiMessage } from "./bpiMessage";
import { Transaction } from "./transaction";
import { TransactionPoolComponent } from "./components/transactions/transactionPool";
import { IMessagingComponent } from "./components/messaging/messaging.interface";
import { IWorkgroupComponent } from "./components/workgroup/workgroup.interface";
import { IIdentityComponent } from "./components/identity/identity.interface";
import { ITransactionPoolComponent } from "./components/transactions/transactionPool.interface";

export class BPI {
    owner: BpiSubject;

    agreement: Agreement = new Agreement;
    transactionPoolComponent: ITransactionPoolComponent;
    identityComponent: IIdentityComponent;
    messagingComponent: IMessagingComponent;
    workgroupComponent: IWorkgroupComponent;

    constructor(
        id: string,
        name: string,
        productIds: string[],
        identityComponent: IIdentityComponent,
        messagingComponent: IMessagingComponent,
        workgroupComponent: IWorkgroupComponent) {

        this.agreement.productIds = productIds; // TODO: Move this to initialize agrement state or something similar

        this.identityComponent = identityComponent;
        this.owner = this.identityComponent.addOrganization(id, name);

        this.messagingComponent = messagingComponent;
        this.transactionPoolComponent = new TransactionPoolComponent(identityComponent);
        this.workgroupComponent = workgroupComponent;
    }

    // IDENTITY API
    addOrganization(id: string, name: string): BpiSubject {
        return this.identityComponent.addOrganization(id, name);
    }

    getOrganizationById(id: string): BpiSubject {
        return this.identityComponent.getOrganizationById(id);
    }

    // IDENTITY API END

    // WORKGROUP API

    getWorkgroups(): Workgroup[] {
        return this.workgroupComponent.getWorkgroups();
    }

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

    signInvitation(invitationId: string, recipientSignature: string, recipientOrgId: string, recipientOrgName: string) {
        const invitation = this.workgroupComponent.getInvitationById(invitationId);

        // TODO: Verify signature from the recipient
        // TODO: What is the state change on agreement acceptance - status?
        const bobsProof = this.createProof(this.agreement, this.agreement, recipientSignature);

        const accepteeOrg = this.identityComponent.addOrganization(recipientOrgId, recipientOrgName);

        const workgroup = this.workgroupComponent.getWorkgroupById(invitation.workgroupId);
        workgroup.addParticipants(accepteeOrg);

        this.agreement.proofs.push(bobsProof);
    }

    // WORKGROUP API END

    createProof(agreementPreviousState: Agreement, proposedChanges: Agreement, signature: string) {
        return Math.random().toString(36).substr(2, 20);
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
            const transaction = this.transactionPoolComponent.convertMessageToTransaction(message);
            const transactionVerificationResult = this.transactionPoolComponent.pushTransaction(transaction);
            
            transaction.from.incrementNonce(); // TODO: Move to identity component (and later account)
            
            if (transactionVerificationResult === undefined) {
                return this.executeWorkstepMessage(message); // TODO: Here state machine pulls transaction and executes
            }
            
            // error message returned send it back to Alice (message has no proof so cannot call verifyProof in tests if transaction invalid)
            else this.messagingComponent.sendMessageToCounterParty(transactionVerificationResult);
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
