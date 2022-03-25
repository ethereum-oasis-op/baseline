import { BPI } from '../bpi/bpi';
import { expect } from 'chai';
import { Workstep } from '../bpi/components/workgroup/workstep';
import { Workgroup } from '../bpi/components/workgroup/workgroup';
import { BpiMessage } from '../bpi/components/messaging/bpiMessage';
import { MockMessagingComponent } from '../bpi/components/messaging/messaging';
import { WorkgroupComponent } from '../bpi/components/workgroup/workgroup.service';
import { IdentityComponent } from '../bpi/components/identity/identity';
import { Order } from '../domain-objects/order';
import { MESSAGE_TYPE_INFO, MESSAGE_TYPE_STORE } from '../bpi/components/messaging/messageTypes';

describe('BPI, Workgroup and Worflow setup', () => {
    it('Given beggining of time, Alice initiates a new BPI with her organization as owner and an inital agreement state object, BPI created with inherent owner and a global agreement', () => {
        const bpiInstance = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new WorkgroupComponent());
        
        expect(bpiInstance.identityComponent.getOwnerBpiSubject().id).to.be.equal("AL1");
        expect(bpiInstance.identityComponent.getOwnerBpiSubject().name).to.be.equal("AliceOrganisation");
        expect(bpiInstance.storageComponent.getAgreementState().productIds.length).to.be.equal(1);
        expect(bpiInstance.storageComponent.getAgreementState().productIds[0]).to.be.equal("555333");
        expect(bpiInstance.storageComponent.getAgreementState().orders).to.be.an("array").that.is.empty;
        expect(bpiInstance.storageComponent.getAgreementState().proofs).to.be.an("array").that.is.empty;
    });

    it('Given freshly instantiated BPI, Alice creates a workgroup, workgroup is added to the BPI and available in the list of workgroups', () => {
        const bpiInstance = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new WorkgroupComponent());

        const exchangeOrdersWorkgroup = bpiInstance.addWorkgroup("AB1", "ABOrder", []);

        expect(bpiInstance.getWorkgroups().length).to.be.equal(1);
        expect(bpiInstance.getWorkgroups()[0].id).to.be.equal(exchangeOrdersWorkgroup.id);
        expect(bpiInstance.getWorkgroups()[0].name).to.be.equal(exchangeOrdersWorkgroup.name);
        expect(bpiInstance.getWorkgroups()[0].participants.length).to.be.equal(1);
        expect(bpiInstance.getWorkgroups()[0].participants[0].id).to.be.equal("AL1");
    });

    it('Given newly created workgroup, Alice creates a workstep, workstep is added to the workgroup and is visible in the list of worksteps for a given workgroup', () => {
        const bpiInstance = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new WorkgroupComponent());
        const exchangeOrdersWorkgroup = bpiInstance.addWorkgroup("AB1", "ABOrder", []);

        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(bpiInstance.storageComponent.getAgreementState().addOrder);
        exchangeOrdersWorkgroup.addWorkstep(workStep);

        expect(exchangeOrdersWorkgroup.worksteps.length).to.be.equal(1);
        expect(exchangeOrdersWorkgroup.worksteps.length).to.be.above(0);
        expect(exchangeOrdersWorkgroup.worksteps[0]).to.be.equal(workStep);
        expect(exchangeOrdersWorkgroup.worksteps[0].id).to.be.equal("W1");
        expect(exchangeOrdersWorkgroup.worksteps[0].name).to.be.equal("WRKSTP1");
    });

    it('Given a prepared workgroup with a workstep, Alice invites Bob, BPI stores the invitation and invitee email and this information is available for querying', () => {
        const bpiInstance = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new WorkgroupComponent());
        const exchangeOrdersWorkgroup = bpiInstance.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(bpiInstance.storageComponent.getAgreementState().addOrder);
        exchangeOrdersWorkgroup.addWorkstep(workStep);

        bpiInstance.inviteToWorkgroup("BI1", "BobsInvite", bpiInstance.identityComponent.getOwnerBpiSubject(), "bob@bob.com", exchangeOrdersWorkgroup.id, bpiInstance.storageComponent.getAgreementState());
        const bobsInvitation = bpiInstance.getInvitationById("BI1");

        expect(bobsInvitation.id).to.be.equal("BI1");
        expect(bobsInvitation.name).to.be.equal("BobsInvite");
        expect(bobsInvitation.recipient).to.be.equal("bob@bob.com");
        expect(bobsInvitation.sender).to.be.equal(bpiInstance.identityComponent.getOwnerBpiSubject());
        expect(bobsInvitation.agreement.productIds).to.be.equal(bpiInstance.storageComponent.getAgreementState().productIds);
    });

    it('Given a sent invitation, Bob queries list of received invitations, can see invitation details from Alice', () => {
        const bpiInstance = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new WorkgroupComponent());
        const exchangeOrdersWorkgroup = bpiInstance.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(bpiInstance.storageComponent.getAgreementState().addOrder);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        bpiInstance.inviteToWorkgroup("BI1", "BobsInvite", bpiInstance.identityComponent.getOwnerBpiSubject(), "bob@bob.com", exchangeOrdersWorkgroup.id, bpiInstance.storageComponent.getAgreementState());

        const bobsInvitations = bpiInstance.getReceivedInvitationsByEmail("bob@bob.com");

        expect(bobsInvitations[0].id).to.be.equal("BI1");
        expect(bobsInvitations[0].name).to.be.equal("BobsInvite");
        expect(bobsInvitations[0].recipient).to.be.equal("bob@bob.com");
        expect(bobsInvitations[0].sender).to.be.equal(bpiInstance.identityComponent.getOwnerBpiSubject());
        expect(bobsInvitations[0].agreement.productIds).to.be.equal(bpiInstance.storageComponent.getAgreementState().productIds);
    });

    it('Given a received invitation, Bob accepts by singing the agreement, Bob is added as a subject to the Bpi, to the collection of workgroup participants and proof is stored in the collection of proofs for the workgroup', () => {
        const bpiInstance = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new WorkgroupComponent());
        const exchangeOrdersWorkgroup = bpiInstance.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(bpiInstance.storageComponent.getAgreementState().addOrder);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        bpiInstance.inviteToWorkgroup("BI1", "BobsInvite", bpiInstance.identityComponent.getOwnerBpiSubject(), "bob@bob.com", exchangeOrdersWorkgroup.id, bpiInstance.storageComponent.getAgreementState());

        const bobsInvitation = bpiInstance.getReceivedInvitationsByEmail("bob@bob.com");
        //signed invitation "triggers" Bpi to create dummy proof and add Bob to orgs and workgroup participants
        bpiInstance.signInvitation(bobsInvitation[0].id, "bobsSignature", "BO1", "BobOrganisation");

        const workgroup = bpiInstance.getWorkgroupById(exchangeOrdersWorkgroup.id);
        expect(bpiInstance.getBpiSubjectById("BO1")).to.not.be.undefined;
        expect(workgroup.participants.length).to.be.equal(2);
        expect(workgroup.participants[1].id).to.be.equal("BO1");
        expect(workgroup.participants[1].name).to.be.equal("BobOrganisation");
        expect(bpiInstance.storageComponent.getAgreementState().proofs.length).to.be.equal(1);
        expect(bpiInstance.storageComponent.getAgreementState().proofs[0].length).to.be.above(0);
    });

    it('Given accepted invite, Alice queries the list of sent invitations, and can verify the proof aginst the Bpi', () => {
        const bpiInstance = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new WorkgroupComponent());
        const exchangeOrdersWorkgroup = bpiInstance.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(bpiInstance.storageComponent.getAgreementState().addOrder);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        bpiInstance.inviteToWorkgroup("BI1", "BobsInvite", bpiInstance.identityComponent.getOwnerBpiSubject(), "bob@bob.com", exchangeOrdersWorkgroup.id, bpiInstance.storageComponent.getAgreementState());
        const bobsInvitation = bpiInstance.getReceivedInvitationsByEmail("bob@bob.com");
        bpiInstance.signInvitation(bobsInvitation[0].id, "bobsSignature", "BO1", "BobOrganisation");
        const invQuedByAlice = bpiInstance.getInvitationById("BI1");

        const proofVerificationResult = bpiInstance.verifyProof(invQuedByAlice.agreement.proofs[0]);

        expect(proofVerificationResult).to.be.true;
    });

});

describe('Exchanging business objects', () => {
    it('Given verified proof, Alice sends request for the order that is valid, the request is verified against the agreement, the proof and order is sent to Bob', () => {
        const [bpiInstance, exchangeOrdersWorkgroup, workstep] = setupOrderExchangeWorkgroupWithACleanAgreementState();

        const orderBusinessObject = new Order("0001", "Purchase", 30, "555333");
        const bpiSubjectAlice = bpiInstance.identityComponent.getBpiSubjectById("AL1");
        const bpiSubjectBob = bpiInstance.identityComponent.getBpiSubjectById("BO1");
        const addOrderMessage = new BpiMessage("M1", MESSAGE_TYPE_STORE, bpiSubjectAlice, bpiSubjectBob, exchangeOrdersWorkgroup.id, workstep.id, orderBusinessObject);

        // Alice sends to BPI for agreement update, validation and proof generation

        const proof = bpiInstance.postMessage(addOrderMessage);
        addOrderMessage.setExecutionProof(proof);

        // Alice sends to BPI to message to Bob
        const orderMessageAdded = createInfoMessageFromStore(addOrderMessage);
        bpiInstance.postMessage(orderMessageAdded);

        // Bob receives\queries messages and fetches the message from Alice

        const receivedMessage = bpiInstance.getMessages(bpiSubjectBob);

        // Bob verifies the state against the BPI

        var verificationResult = bpiInstance.verifyProof(receivedMessage[0].executionProof)

        expect(bpiInstance.storageComponent.getAgreementState().orders.length).to.be.equal(1);
        expect(bpiInstance.storageComponent.getAgreementState().orders[0].acceptanceStatus).to.be.equal("pending");
        expect(bpiInstance.storageComponent.getAgreementState().proofs.length).to.be.equal(2);
        expect(verificationResult).to.be.true;
    });

    it('Given newly setup workgroup between Alice and Bob, Alice sends request for the order that is invalid, the request is verified against the agreement, error response is sent back to Alice', () => {
        const [bpiInstance, exchangeOrdersWorkgroup, workstep] = setupOrderExchangeWorkgroupWithACleanAgreementState();

        const orderBusinessObject = new Order("0001", "Purchase", 15, "555333");

        const bpiSubjectAlice = bpiInstance.identityComponent.getBpiSubjectById("AL1");
        const bpiSubjectBob = bpiInstance.identityComponent.getBpiSubjectById("BO1");
        const addOrderMessage = new BpiMessage("M1", MESSAGE_TYPE_STORE, bpiSubjectAlice, bpiSubjectBob, exchangeOrdersWorkgroup.id, workstep.id, orderBusinessObject);

        const proof = bpiInstance.postMessage(addOrderMessage);

        expect(proof).to.be.equal("err: workstep execution failed to satisfy the agreement.");
    });

    it('Given Bob receives a positive result, Bob performs acceptance, the acceptance is returned to Alice', () => {
        const [bpiInstance, exchangeOrdersWorkgroup, workstep] = setupOrderExchangeWorkgroupWithACleanAgreementState();

        const orderBusinessObject = new Order("0001", "Purchase", 30, "555333");

        const bpiSubjectAlice = bpiInstance.identityComponent.getBpiSubjectById("AL1");
        const bpiSubjectBob = bpiInstance.identityComponent.getBpiSubjectById("BO1");
        const addOrderMessage = new BpiMessage("M1", MESSAGE_TYPE_STORE, bpiSubjectAlice, bpiSubjectBob, exchangeOrdersWorkgroup.id, workstep.id, orderBusinessObject);

        // Alice sends to BPI for agreement update, validation and proof generation
        let proof = bpiInstance.postMessage(addOrderMessage);
        addOrderMessage.setExecutionProof(proof);

        const orderMessageAdded = createInfoMessageFromStore(addOrderMessage);
        bpiInstance.postMessage(orderMessageAdded);

        // Create workStep2, set workStep's business logic, and add work step to workgroup
        const workstep2 = new Workstep("W2", "WRKSTP2");
        workstep2.setBusinessLogicToExecute(bpiInstance.storageComponent.getAgreementState().acceptOrder);
        exchangeOrdersWorkgroup.addWorkstep(workstep2);
        
        // Bob sends to BPI for agreement update, validation, and proof generation
        const acceptOrderMessage = new BpiMessage("M2", MESSAGE_TYPE_STORE, bpiSubjectBob, bpiSubjectAlice, exchangeOrdersWorkgroup.id, workstep2.id, orderBusinessObject);
        proof = bpiInstance.postMessage(acceptOrderMessage);
        acceptOrderMessage.setExecutionProof(proof);

        const orderMessageAccepted = createInfoMessageFromStore(acceptOrderMessage);
        bpiInstance.postMessage(orderMessageAccepted);

        // Alice receives\queries messages and fetches the message from Bob
        const receivedMessage = bpiInstance.getMessages(bpiSubjectAlice);

        // Alice verifies the state against the BPI
        const verificationResult = bpiInstance.verifyProof(receivedMessage[0].executionProof);

        expect(bpiInstance.storageComponent.getAgreementState().orders.length).to.be.equal(1);
        expect(bpiInstance.storageComponent.getAgreementState().orders[0].acceptanceStatus).to.be.equal("accepted");
        expect(bpiInstance.storageComponent.getAgreementState().proofs.length).to.be.equal(3);
        expect(bpiInstance.storageComponent.getAgreementState().proofs[2]).to.be.equal(proof);
        expect(verificationResult).to.be.true;
    });

    function setupOrderExchangeWorkgroupWithACleanAgreementState(): [BPI, Workgroup, Workstep] {
        const bpiInstance = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new WorkgroupComponent());
        const exchangeOrdersWorkgroup = bpiInstance.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(bpiInstance.storageComponent.getAgreementState().addOrder);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        bpiInstance.inviteToWorkgroup("BI1", "BobsInvite", bpiInstance.identityComponent.getOwnerBpiSubject(), "bob@bob.com", exchangeOrdersWorkgroup.id, bpiInstance.storageComponent.getAgreementState());
        const bobsInvitation = bpiInstance.getReceivedInvitationsByEmail("bob@bob.com");
        bpiInstance.signInvitation(bobsInvitation[0].id, "bobsSignature", "BO1", "BobOrganisation");

        return [bpiInstance, exchangeOrdersWorkgroup, workStep];
    }

    function  createInfoMessageFromStore(storeMessage: BpiMessage): BpiMessage {
        const infoMessage = {} as BpiMessage;
        
        Object.assign(infoMessage, storeMessage);
        infoMessage.type = MESSAGE_TYPE_INFO;

        return infoMessage;
    }
});