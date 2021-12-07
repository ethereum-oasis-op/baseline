import { BPI } from '../bpi/bpi';
import { expect } from 'chai';
import { Agreement } from '../bpi/agreement';
import { Workstep } from '../bpi/workstep';
import { Order } from '../bpi/order';

describe('BPI, Workgroup and Worflow setup', () => {
    it('Given beggining of time, Alice initiates a new BPI with her organization as owner and an inital agreement state object, BPI created with inherent owner and a global agreement', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"]);

        expect(aliceBpi.owner.id).to.be.equal("AL1");
        expect(aliceBpi.owner.name).to.be.equal("AliceOrganisation");
        expect(aliceBpi.agreement.productIds.length).to.be.equal(1);
        expect(aliceBpi.agreement.productIds[0]).to.be.equal("555333");
        expect(aliceBpi.agreement.orders).to.be.an("array").that.is.empty;
        expect(aliceBpi.agreement.proofs).to.be.an("array").that.is.empty;
    });

    it('Given freshly instantiated BPI, Alice creates a workgroup, workgroup is added to the BPI and available in the list of workgroups', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"]);

        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);

        expect(aliceBpi.workgroups.length).to.be.equal(1);
        expect(aliceBpi.workgroups[0].id).to.be.equal(exchangeOrdersWorkgroup.id);
        expect(aliceBpi.workgroups[0].name).to.be.equal(exchangeOrdersWorkgroup.name);
        expect(aliceBpi.workgroups[0].participants.length).to.be.equal(1);
        expect(aliceBpi.workgroups[0].participants[0].id).to.be.equal("AL1");
    });

    it('Given newly created workgroup, Alice creates a workstep, workstep is added to the workgroup and is visible in the list of worksteps for a given workgroup', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"]);
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.idsMatch);
        exchangeOrdersWorkgroup.addWorkstep(workStep);

        expect(exchangeOrdersWorkgroup.worksteps.length).to.be.equal(1);
        expect(exchangeOrdersWorkgroup.worksteps.length).to.be.above(0);
        expect(exchangeOrdersWorkgroup.worksteps[0]).to.be.equal(workStep);
        expect(exchangeOrdersWorkgroup.worksteps[0].id).to.be.equal("W1");
        expect(exchangeOrdersWorkgroup.worksteps[0].name).to.be.equal("WRKSTP1");
    });

    it('Given a prepared workgroup with a workstep, Alice invites Bob, BPI stores the invitation and invitee email and this information is available for querying', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"]);
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.idsMatch);
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
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"]);
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.idsMatch);
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
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"]);
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.idsMatch);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        const inviteBob = aliceBpi.inviteToWorkgroup("BI1", "BobsInvite", aliceBpi.owner, "bob@bob.com", exchangeOrdersWorkgroup.id, aliceBpi.agreement);

        //the invitation is signed (so the invitation has a sign method)
        const bobsEnteredData = inviteBob.sign();
        //signed invitation "triggers" Bpi to create dummy proof and add Bob to orgs and workgrouop participants
        aliceBpi.signedInviteEvent(inviteBob.id, bobsEnteredData);
        //Agreement signed?

        expect(aliceBpi.agreement.signature).to.be.true;
        //Bob is added as subject to bpi?
        expect(aliceBpi.getOrganizationById("BO1")).to.not.be.undefined;
        //Bob is added to participants to workgroup?
        expect(aliceBpi.getWorkgroupById(exchangeOrdersWorkgroup.id).participants.length).to.be.equal(2);
        expect(aliceBpi.getWorkgroupById(exchangeOrdersWorkgroup.id).participants[1].id).to.be.equal("BO1");
        expect(aliceBpi.getWorkgroupById(exchangeOrdersWorkgroup.id).participants[1].name).to.be.equal("BobOrganisation");
        //Store some rand proof is in the agreement proofs?
        expect(aliceBpi.agreement.proofs).to.not.be.empty;
        expect(aliceBpi.agreement.proofs[0].length).to.be.above(0);
    });

    it('Given accepted invite, Alice queries the list of sent invitations, and can verify the proof aginst the Bpi', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"]);
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.idsMatch);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        const inviteBob = aliceBpi.inviteToWorkgroup("BI1", "BobsInvite", aliceBpi.owner, "bob@bob.com", exchangeOrdersWorkgroup.id, aliceBpi.agreement);
        const bobsEnteredData = inviteBob.sign();
        aliceBpi.signedInviteEvent(inviteBob.id, bobsEnteredData);


        const invQuedByAlice = aliceBpi.getInvitationById("BI1");

        expect(invQuedByAlice).to.be.equal(inviteBob);
        //check if signed
        expect(invQuedByAlice.agreement.signature).to.be.true;
        //verify proof against bpi
        expect(aliceBpi.verifyProof(invQuedByAlice.agreement.proofs[0])).to.be.true;
        // Add something here??? Now is just a dummy proof check with a true/false response from Bpi
    });

    it('Given verified proof, Alice sends request for the order that is valid, the request is verified against the agreement, the proof and order is sent to Bob', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"]);
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.orderPriceIsGreater);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        const inviteBob = aliceBpi.inviteToWorkgroup("BI1", "BobsInvite", aliceBpi.owner, "bob@bob.com", exchangeOrdersWorkgroup.id, aliceBpi.agreement);
        const bobsEnteredData = inviteBob.sign();
        aliceBpi.signedInviteEvent(inviteBob.id, bobsEnteredData);

        //Alice creates an order with a given price...that will be checked in the validation process
        const businessObject = new Order("0001", "Purchase", 30);
        //Order is saved in Alices databse of orders
        const aliceOrg = aliceBpi.getOrganizationById("AL1");
        aliceOrg.orders.push(businessObject); // TODO: Ognjen we do not want orders store on the level of bpisubjects, this should be in the agreement if workstep ok
        // or otherwise as a message

        //send request with the order (valid)
        const bpiResponse = aliceBpi.sendOrder(businessObject, exchangeOrdersWorkgroup.id);

        //if order is saved in Alices org
        expect(aliceOrg.orders.length).to.be.above(0);
        //if order is saved in Bobs org
        expect(aliceBpi.getOrganizationById("BO1").orders.length).to.be.above(0);
        //if proof is saved in Bobs org
        expect(aliceBpi.getOrganizationById("BO1").proofForActualWorkstep).to.not.be.undefined;
        //if response from bpi to alice is true or false
        expect(bpiResponse[0]).to.be.true;
        //if response message from bpi to alice is error or not
        expect(bpiResponse[1]).to.not.be.equal("Error: Message");
        //if proof is same as saved in agreement
        expect(bpiResponse[1]).to.be.equal(aliceBpi.agreement.proofs[1]);
        //if proof was added to agreement
        expect(aliceBpi.agreement.proofs.length).to.be.equal(2);
    });

    it('Given verified proof, Alice sends request for the order that is invalid, the request is verified against the agreement, error response is sent back to Alice', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"]);
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.orderPriceIsGreater);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        const inviteBob = aliceBpi.inviteToWorkgroup("BI1", "BobsInvite", aliceBpi.owner, "bob@bob.com", exchangeOrdersWorkgroup.id, aliceBpi.agreement);
        const bobsEnteredData = inviteBob.sign();
        aliceBpi.signedInviteEvent(inviteBob.id, bobsEnteredData);

        //Alice creates an order with a given price...that will be checked in the validation process
        const businessObject = new Order("0001", "Purchase", 15);
        //Order is saved in Alices databse of orders
        const aliceOrg = aliceBpi.getOrganizationById("AL1");
        aliceOrg.orders.push(businessObject);
        //send request with the order (invalid)
        const bpiResponse = aliceBpi.sendOrder(businessObject, exchangeOrdersWorkgroup.id);

        //if order is saved in Alices org
        expect(aliceOrg.orders.length).to.be.above(0);
        //if order is saved in Bobs org
        expect(aliceBpi.getOrganizationById("BO1").orders.length).to.be.equal(0);
        //if proof is saved in Bobs org
        expect(aliceBpi.getOrganizationById("BO1").proofForActualWorkstep).to.be.undefined;
        //if response from bpi to alice is true or false
        expect(bpiResponse[0]).to.not.be.true;
        //if response message from bpi to alice is error or not
        expect(bpiResponse[1]).to.be.equal("Error: Message");
        //if proof is same as saved in agreement
        expect(aliceBpi.agreement.proofs.length).to.be.equal(1);
    });

    it('Given recieved Order, Bob validates proof against Bpi, gets positive result from Bpi', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"]);
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.orderPriceIsGreater);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        const inviteBob = aliceBpi.inviteToWorkgroup("BI1", "BobsInvite", aliceBpi.owner, "bob@bob.com", exchangeOrdersWorkgroup.id, aliceBpi.agreement);
        const bobsEnteredData = inviteBob.sign();
        aliceBpi.signedInviteEvent(inviteBob.id, bobsEnteredData);
        //Alice creates an order with a given price...that will be checked in the validation process
        const businessObject = new Order("0001", "Purchase", 30);
        //Order is saved in Alices databse of orders
        const aliceOrg = aliceBpi.getOrganizationById("AL1");
        aliceOrg.orders.push(businessObject);
        //send request with the order (valid)
        const bpiResponse = aliceBpi.sendOrder(businessObject, exchangeOrdersWorkgroup.id);
        //bob validates the recieved proof and should recieve a positive result
        const bpiResponseForBob = aliceBpi.verifyProof(aliceBpi.getOrganizationById("BO1").proofForActualWorkstep);
        //if response is true or false
        expect(bpiResponseForBob).to.be.true;
    });

    it('Given Bob receives a positive result, Bob performs acceptance, the acceptance is returned to Alice', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"]);
        const exchangeOrdersWorkgroup = aliceBpi.addWorkgroup("AB1", "ABOrder", []);
        const workStep = new Workstep("W1", "WRKSTP1");
        workStep.setBusinessLogicToExecute(aliceBpi.agreement.orderPriceIsGreater);
        exchangeOrdersWorkgroup.addWorkstep(workStep);
        const inviteBob = aliceBpi.inviteToWorkgroup("BI1", "BobsInvite", aliceBpi.owner, "bob@bob.com", exchangeOrdersWorkgroup.id, aliceBpi.agreement);
        const bobsEnteredData = inviteBob.sign();
        aliceBpi.signedInviteEvent(inviteBob.id, bobsEnteredData);
        //Alice creates an order with a given price...that will be checked in the validation process
        const businessObject = new Order("0001", "Purchase", 30);
        //Order is saved in Alices databse of orders
        const aliceOrg = aliceBpi.getOrganizationById("AL1");
        aliceOrg.orders.push(businessObject);
        //send request with the order (valid)
        const bpiResponseForAlice = aliceBpi.sendOrder(businessObject, exchangeOrdersWorkgroup.id);
        //bob validates the recieved proof and should recieve a positive result
        const bpiResponseForBob = aliceBpi.verifyProof(aliceBpi.getOrganizationById("BO1").proofForActualWorkstep);
        //bpi registers accept/decline with order id 
        aliceBpi.acceptOrder(businessObject.id);

        //if Bobs order status updated to accepted
        expect(aliceBpi.getOrganizationById("BO1").getOrderById("0001").acceptanceStatus).to.be.equal("accepted");
        //proof to be updated to new one
        expect(aliceBpi.getOrganizationById("BO1").proofForActualWorkstep).to.be.equal(aliceBpi.agreement.proofs[2]);
        //if Alices order status updated to accepted
        expect(aliceBpi.getOrganizationById("AL1").getOrderById("0001").acceptanceStatus).to.be.equal("accepted");
        //proof to be equal to recieved one
        expect(aliceBpi.getOrganizationById("AL1").proofForActualWorkstep).to.be.equal(aliceBpi.agreement.proofs[2]);
    });

    it('Alice receives Bobs acceptance and proof, Alice validates the proof, Alice recieves a positive result', () => {
        expect(1).to.be.equal(2);
    });
});



// One BPI per use-case that can be hosted at Bob's, Alice's or any other infrastructure.

// Alice and bob use BPI clients to communicate with the BPI instance.

// OrgRegistry is per BPI. It is just an implementation of the authz for workflows from bri-1. Standards document
// covers this with policies.

// Alice prepares an agreement, which contains all the elements required to validate a state transition. 
// Product ids for example. Alice instantiates the BPI with a state object carying product ids representing the agreement
// between Alice and Bob.

// T0 - Agree on initial agreement
            // |
            // |
// T1 - Alice Request quote
            // |
            // |
// T2 - Bob Submit quote

// Alice prepares the workgroup with the worksteps. Workstep example:
    // predicate: "request quote"
    // Scope is Alice sending and Bob accepting
    // Bob signature completes the worksteps and updates the agreement state object
    // Circuit 'executes' the business logic of the workstep (i.e. does the quote contain agreement product id)


// Alice finds Bob's contacts information through whatever channel and sends a link with workgroup invitation
// information. Invitation includes:
    // 1. Initial agreement which has to be signed by Bob.
    // 2. APIs available - Wokflow\Workstep level Api definition so that BOBs SOR can speak the languagle of the BPI
    // and propose state changes of the agreement

// All other communcation between Alice and Bob goes through the messaging component