import { Agreement } from "./components/storage/agreement";
import { BpiSubject } from "./components/identity/bpiSubject";
import { Invitation } from "./components/workgroup/invitation";
import { Workgroup } from "./components/workgroup/workgroup";
import { Workstep } from "./components/workgroup/workstep";
import { BpiMessage } from "./components/messaging/bpiMessage";
import { TransactionPoolComponent } from "./components/transactions/transactionPool";
import { IMessagingComponent } from "./components/messaging/messaging.interface";
import { IWorkgroupComponent } from "./components/workgroup/workgroup.interface";
import { IIdentityComponent } from "./components/identity/identity.interface";
import { ITransactionPoolComponent } from "./components/transactions/transactionPool.interface";
import { IVirtualStateMachineComponent } from "./components/vsm/vsm.interface";
import { VirtualStateMachine } from "./components/vsm/vsm";
import { IStorageComponent } from "./components/storage/storage.interface";
import { StorageComponent } from "./components/storage/storage";

export class BPI {
    identityComponent: IIdentityComponent;
    messagingComponent: IMessagingComponent;
    workgroupComponent: IWorkgroupComponent;
    transactionPoolComponent: ITransactionPoolComponent;
    vsmComponent: IVirtualStateMachineComponent;
    storageComponent: IStorageComponent;

    constructor(
        id: string,
        name: string,
        productIds: string[],
        identityComponent: IIdentityComponent,
        messagingComponent: IMessagingComponent,
        workgroupComponent: IWorkgroupComponent) {

        this.storageComponent = new StorageComponent();
        const initalAgreement = new Agreement();
        initalAgreement.productIds = productIds;
        this.storageComponent.setInitialAgreementState(initalAgreement);

        this.identityComponent = identityComponent;
        const ownerOrg = this.identityComponent.addOrganization(id, name);
        this.identityComponent.setOwnerOrganization(ownerOrg);

        this.messagingComponent = messagingComponent;
        this.transactionPoolComponent = new TransactionPoolComponent(identityComponent);
        this.workgroupComponent = workgroupComponent;
        this.vsmComponent = new VirtualStateMachine(this.storageComponent, this.workgroupComponent)
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
        return this.workgroupComponent.createWorkgroup(name, id, this.identityComponent.getOwnerOrganization(), worksteps);
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

    // TODO: Should go through the VSM execution process, probably with a special INIT transaction and workstep
    signInvitation(invitationId: string, recipientSignature: string, recipientOrgId: string, recipientOrgName: string) {
        const invitation = this.workgroupComponent.getInvitationById(invitationId);

        // TODO: Verify signature from the recipient
        // TODO: What is the state change on agreement acceptance - status?
        const latestAgreementState = this.storageComponent.getAgreementState();
        const bobsProof = this.vsmComponent.createProof(latestAgreementState, latestAgreementState, recipientSignature);

        const accepteeOrg = this.identityComponent.addOrganization(recipientOrgId, recipientOrgName);

        const workgroup = this.workgroupComponent.getWorkgroupById(invitation.workgroupId);
        workgroup.addParticipants(accepteeOrg);

        latestAgreementState.proofs.push(bobsProof);
    }

    // WORKGROUP API END

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
            
            if (transactionVerificationResult === undefined) {
                transaction.from.incrementNonce(); // TODO: Move to identity component (and later account)
                // TODO: In real implementation, vsm would pool the transaction pool for batches
                return this.vsmComponent.executeTransaction(transaction);
            }
            
            // error message returned send it back to Alice (message has no proof so cannot call verifyProof in tests if transaction invalid)
            else this.messagingComponent.sendMessageToCounterParty(transactionVerificationResult);
        }
    }

    getMessages(subject: BpiSubject): BpiMessage[] {
        return this.messagingComponent.getNewvlyReceivedMessages(subject);
    }

    // MESAGGING API END
}
