import { BPI } from '../bpi/bpi';
import { expect } from 'chai';
import { Workstep } from '../bpi/workstep';
import { Order } from '../domain-objects/order';
import { Workgroup } from '../bpi/workgroup';
import { BpiMessage } from '../bpi/bpiMessage';
import { MockMessagingComponent } from '../bpi/components/messaging/messaging';
import { MockWorkgroupComponent } from '../bpi/components/workgroup/workgroup';
import { IdentityComponent } from '../bpi/components/identity/identity';

describe('BPI, Workgroup and Worflow setup', () => {
    it('Given beggining of time, Alice initiates a new BPI with her organization as owner and an inital agreement state object, BPI created with inherent owner and a global agreement', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new MockWorkgroupComponent());

        expect(aliceBpi.owner.id).to.be.equal("AL1");
        expect(aliceBpi.owner.name).to.be.equal("AliceOrganisation");
        expect(aliceBpi.agreement.productIds.length).to.be.equal(1);
        expect(aliceBpi.agreement.productIds[0]).to.be.equal("555333");
        expect(aliceBpi.agreement.orders).to.be.an("array").that.is.empty;
        expect(aliceBpi.agreement.proofs).to.be.an("array").that.is.empty;
    });

    it('Given freshly instantiated BPI, Alice creates a workgroup, workgroup is added to the BPI and available in the list of workgroups', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new MockWorkgroupComponent());

        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);

        expect(aliceBpi.getWorkgroups().length).to.be.equal(1);
        expect(aliceBpi.getWorkgroups()[0].id).to.be.equal(exchangeOrdersWorkgroup.id);
        expect(aliceBpi.getWorkgroups()[0].name).to.be.equal(exchangeOrdersWorkgroup.name);
        expect(aliceBpi.getWorkgroups()[0].participants.length).to.be.equal(1);
        expect(aliceBpi.getWorkgroups()[0].participants[0].id).to.be.equal("AL1");
    });

    it('Given newly created workgroup, Alice creates a workstep, workstep is added to the workgroup and is visible in the list of worksteps for a given workgroup', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new MockWorkgroupComponent());
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.addOrder);
        exchangeOrdersWorkgroup.addWorkstep(workStep);

        expect(exchangeOrdersWorkgroup.worksteps.length).to.be.equal(1);
        expect(exchangeOrdersWorkgroup.worksteps.length).to.be.above(0);
        expect(exchangeOrdersWorkgroup.worksteps[0]).to.be.equal(workStep);
        expect(exchangeOrdersWorkgroup.worksteps[0].id).to.be.equal("W1");
        expect(exchangeOrdersWorkgroup.worksteps[0].name).to.be.equal("WRKSTP1");
    });

    it('Given a prepared workgroup with a workstep, Alice invites Bob, BPI stores the invitation and invitee email and this information is available for querying', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new MockWorkgroupComponent());
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.addOrder);
        exchangeOrdersWorkgroup.addWorkstep(workStep);

        aliceBpi.inviteToWorkgroup("BI1", "BobsInvite", aliceBpi.owner, "bob@bob.com", exchangeOrdersWorkgroup.id, aliceBpi.agreement);
        const bobsInvitation = aliceBpi.getInvitationById("BI1");

        expect(bobsInvitation.id).to.be.equal("BI1");
        expect(bobsInvitation.name).to.be.equal("BobsInvite");
        expect(bobsInvitation.recipient).to.be.equal("bob@bob.com");
        expect(bobsInvitation.sender).to.be.equal(aliceBpi.owner);
        expect(bobsInvitation.agreement.productIds).to.be.equal(aliceBpi.agreement.productIds);
    });

    it('Given a sent invitation, Bob queries list of received invitations, can see invitation details from Alice', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new MockWorkgroupComponent());
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.addOrder);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        aliceBpi.inviteToWorkgroup("BI1", "BobsInvite", aliceBpi.owner, "bob@bob.com", exchangeOrdersWorkgroup.id, aliceBpi.agreement);
        
        const bobsInvitations = aliceBpi.getReceivedInvitationsByEmail("bob@bob.com");

        expect(bobsInvitations[0].id).to.be.equal("BI1");
        expect(bobsInvitations[0].name).to.be.equal("BobsInvite");
        expect(bobsInvitations[0].recipient).to.be.equal("bob@bob.com");
        expect(bobsInvitations[0].sender).to.be.equal(aliceBpi.owner);
        expect(bobsInvitations[0].agreement.productIds).to.be.equal(aliceBpi.agreement.productIds);
    });

    it('Given a received invitation, Bob accepts by singing the agreement, Bob is added as a subject to the Bpi, to the collection of workgroup participants and proof is stored in the collection of proofs for the workgroup', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new MockWorkgroupComponent());
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.addOrder);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        aliceBpi.inviteToWorkgroup("BI1", "BobsInvite", aliceBpi.owner, "bob@bob.com", exchangeOrdersWorkgroup.id, aliceBpi.agreement);

        const bobsInvitation = aliceBpi.getReceivedInvitationsByEmail("bob@bob.com");
        //signed invitation "triggers" Bpi to create dummy proof and add Bob to orgs and workgroup participants
        aliceBpi.signInvitation(bobsInvitation[0].id, "bobsSignature", "BO1", "BobOrganisation");

        const workgroup = aliceBpi.getWorkgroupById(exchangeOrdersWorkgroup.id); 
        expect(aliceBpi.getOrganizationById("BO1")).to.not.be.undefined;
        expect(workgroup.participants.length).to.be.equal(2);
        expect(workgroup.participants[1].id).to.be.equal("BO1");
        expect(workgroup.participants[1].name).to.be.equal("BobOrganisation");
        expect(aliceBpi.agreement.proofs.length).to.be.equal(1);
        expect(aliceBpi.agreement.proofs[0].length).to.be.above(0);
    });

    it('Given accepted invite, Alice queries the list of sent invitations, and can verify the proof aginst the Bpi', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new MockWorkgroupComponent());
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.addOrder);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        aliceBpi.inviteToWorkgroup("BI1", "BobsInvite", aliceBpi.owner, "bob@bob.com", exchangeOrdersWorkgroup.id, aliceBpi.agreement);        
        const bobsInvitation = aliceBpi.getReceivedInvitationsByEmail("bob@bob.com");
        aliceBpi.signInvitation(bobsInvitation[0].id, "bobsSignature", "BO1", "BobOrganisation");
        const invQuedByAlice = aliceBpi.getInvitationById("BI1");

        const proofVerificationResult = aliceBpi.verifyProof(invQuedByAlice.agreement.proofs[0]);

        expect(proofVerificationResult).to.be.true;
    });

});

describe('Exchanging business objects', () => {
    it('Given verified proof, Alice sends request for the order that is valid, the request is verified against the agreement, the proof and order is sent to Bob', () => {
        const [aliceBpi, exchangeOrdersWorkgroup, workstep] = setupOrderExchangeWorkgroupWithACleanAgreementState();

        const orderBusinessObject = new Order("0001", "Purchase", 30, "555333");
        const orgAlice = aliceBpi.identityComponent.getOrganizationById("AL1");
        const orgBob = aliceBpi.identityComponent.getOrganizationById("BO1");
        const addOrderMessage = new BpiMessage("M1", "STORE", orgAlice, orgBob, exchangeOrdersWorkgroup.id, workstep.id, orderBusinessObject);

        // Alice sends to BPI for agreement update, validation and proof generation

        const proof = aliceBpi.postMessage(addOrderMessage);
        addOrderMessage.setExecutionProof(proof);

        // Alice sends to BPI to message to Bob
        const orderMessageAdded = createInfoMessageFromStore(addOrderMessage);
        aliceBpi.postMessage(orderMessageAdded);

        // Bob receives\queries messages and fetches the message from Alice

        const receivedMessage = aliceBpi.getMessages(orgBob);
        
        // Bob verifies the state against the BPI

        var verificationResult = aliceBpi.verifyProof(receivedMessage[0].executionProof)

        expect(aliceBpi.agreement.orders.length).to.be.equal(1);
        expect(aliceBpi.agreement.orders[0].acceptanceStatus).to.be.equal("pending");
        expect(aliceBpi.agreement.proofs.length).to.be.equal(2);
        expect(verificationResult).to.be.true;
    });

    it('Given newly setup workgroup between Alice and Bob, Alice sends request for the order that is invalid, the request is verified against the agreement, error response is sent back to Alice', () => {
        const [aliceBpi, exchangeOrdersWorkgroup, workstep] = setupOrderExchangeWorkgroupWithACleanAgreementState();

        const orderBusinessObject = new Order("0001", "Purchase", 15, "555333");
        const orgAlice = aliceBpi.identityComponent.getOrganizationById("AL1");
        const orgBob = aliceBpi.identityComponent.getOrganizationById("BO1");
        const addOrderMessage = new BpiMessage("M1", "STORE", orgAlice, orgBob, exchangeOrdersWorkgroup.id, workstep.id, orderBusinessObject);

        const proof = aliceBpi.executeWorkstepMessage(addOrderMessage);

        expect(proof).to.be.equal("err: workstep execution failed to satisfy the agreement.");
    });

    it('Given Bob receives a positive result, Bob performs acceptance, the acceptance is returned to Alice', () => {
        const [aliceBpi, exchangeOrdersWorkgroup, workstep] = setupOrderExchangeWorkgroupWithACleanAgreementState();
        const orderBusinessObject = new Order("0001", "Purchase", 30, "555333");
        const orgAlice = aliceBpi.identityComponent.getOrganizationById("AL1");
        const orgBob = aliceBpi.identityComponent.getOrganizationById("BO1");
        const addOrderMessage = new BpiMessage("M1", "STORE", orgAlice, orgBob, exchangeOrdersWorkgroup.id, workstep.id, orderBusinessObject);

        // Alice sends to BPI for agreement update, validation and proof generation
        let proof = aliceBpi.postMessage(addOrderMessage);
        addOrderMessage.setExecutionProof(proof);

        const orderMessageAdded = createInfoMessageFromStore(addOrderMessage);
        aliceBpi.postMessage(orderMessageAdded);

        // Create workStep2, set workStep's business logic, and add work step to workgroup
        const workstep2 = new Workstep("W2", "WRKSTP2");
        workstep2.setBusinessLogicToExecute(aliceBpi.agreement.acceptOrder);
        exchangeOrdersWorkgroup.addWorkstep(workstep2);
        
        // Bob sends to BPI for agreement update, vlaidation, and proof generation
        const acceptOrderMessage = new BpiMessage("M2", "STORE", orgBob, orgAlice, exchangeOrdersWorkgroup.id, workstep2.id, orderBusinessObject);
        proof = aliceBpi.postMessage(acceptOrderMessage);
        acceptOrderMessage.setExecutionProof(proof);

        const orderMessageAccepted = createInfoMessageFromStore(acceptOrderMessage);
        aliceBpi.postMessage(orderMessageAccepted);
        
        // Alice receives\queries messages and fetches the message from Bob
        const receivedMessage = aliceBpi.getMessages(orgAlice);

        // Alice verifies the state against the BPI
        const verificationResult = aliceBpi.verifyProof(receivedMessage[0].executionProof);

        expect(aliceBpi.agreement.orders.length).to.be.equal(1);
        expect(aliceBpi.agreement.orders[0].acceptanceStatus).to.be.equal("accepted");
        expect(aliceBpi.agreement.proofs.length).to.be.equal(3);
        expect(aliceBpi.agreement.proofs[2]).to.be.equal(proof);
        expect(verificationResult).to.be.true;
    });

    function setupOrderExchangeWorkgroupWithACleanAgreementState(): [BPI, Workgroup, Workstep] {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"], new IdentityComponent(), new MockMessagingComponent(), new MockWorkgroupComponent());
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.addOrder);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        aliceBpi.inviteToWorkgroup("BI1", "BobsInvite", aliceBpi.owner, "bob@bob.com", exchangeOrdersWorkgroup.id, aliceBpi.agreement);        
        const bobsInvitation = aliceBpi.getReceivedInvitationsByEmail("bob@bob.com");
        aliceBpi.signInvitation(bobsInvitation[0].id, "bobsSignature", "BO1", "BobOrganisation");

        return [aliceBpi, exchangeOrdersWorkgroup, workStep];
    }

    function  createInfoMessageFromStore(storeMessage: BpiMessage): BpiMessage {
        const infoMessage = {} as BpiMessage;
        
        Object.assign(infoMessage, storeMessage);
        infoMessage.type = "INFO";

        return infoMessage;
    }
});