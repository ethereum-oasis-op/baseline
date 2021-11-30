import { BPI } from '../bpi/bpi';
import { expect } from 'chai';
import { Agreement } from '../bpi/agreement';
import { Workstep } from '../bpi/workstep';

describe('BPI, Workgroup and Worflow setup', () => {
    it('Given beggining of time, Alice initiates a new BPI with her organization as owner and an inital agreement state object, BPI created with inherent owner and a global agreement', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"] );

        expect(aliceBpi.owner.id).to.be.equal("AL1");
        expect(aliceBpi.owner.name).to.be.equal("AliceOrganisation");
        expect(aliceBpi.agreement.productIds.length).to.be.equal(1);
        expect(aliceBpi.agreement.productIds[0]).to.be.equal("555333");
        expect(aliceBpi.agreement.orders).to.be.an("array").that.is.empty;
        expect(aliceBpi.agreement.proofs).to.be.an("array").that.is.empty;
    });

    it('Given freshly instantiated BPI, Alice creates a workgroup, workgroup is added to the BPI and available in the list of workgroups', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"] );
        const orderGroup = aliceBpi.addWorkgroup("AB1","ABOrder",[]);

        expect(aliceBpi.workgroups.length).to.be.equal(1);
        expect(aliceBpi.workgroups[0].id).to.be.equal(orderGroup.id);
        expect(aliceBpi.workgroups[0].name).to.be.equal(orderGroup.name);
        expect(aliceBpi.workgroups[0].participants.length).to.be.equal(1);
        expect(aliceBpi.workgroups[0].participants[0].id).to.be.equal("AL1");
    });

    it('Given newly created workgroup, Alice creates a workstep, workstep is added to the workgroup and is visible in the list of worksteps for a given workgroup', () => {
        const aliceBpi = new BPI("AL1", "AliceOrganisation", ["555333"] );
        const orderGroup = aliceBpi.addWorkgroup("AB1","ABOrder",[]);
    });

    // we assume one workgroup and one workstep 
    it('Given a prepared workgroup, Alice invites Bob, BPI stored the invitation and invitee email and this information is available to Bob though a list of invitations', () => {
        expect(1).to.be.equal(2);
    });

    it('Given a sent invitation, Alice queries list of sent invitations, can see Bob invitation details', () => {
        expect(1).to.be.equal(2);
    });

    it('Given a sent invitation, Bob queries list of received invitations, can see invitation details from Alice', () => {
        expect(1).to.be.equal(2);
    });

    it('Given a received invitation, Bob accepts by singing the agreement, Bob is added as a subject to the Bpi, to the collection of workgroup participants and proof is stored in the collection of proofs for the workgroup', () => {
        expect(1).to.be.equal(2);
    });

    it('Given accepted invite, Alice queries the list of sent invitations, and can verify the proof aginst the Bpi', () => {
        expect(1).to.be.equal(2);
    });

    it('Given verified proof, Alice sends request for the order that is valid, the request is verified against the agreement, the proof and order is sent to Bob', () => {
        expect(1).to.be.equal(2);
    });

    it('Given verified proof, Alice sends request for the order that is invalid, the request is verified against the agreement, error response is sent back to Alice', () => {
        expect(1).to.be.equal(2);
    });

    it('Given recieved Order, Bob validates proof against Bpi, gets positive result from Bpi', () => {
        expect(1).to.be.equal(2);
    });

    it('Given Bob receives a positive result, Bob performs acceptance, the acceptance is returned to Alice', () => {
        expect(1).to.be.equal(2);
    });

    it('Alice receives Bobs acceptance proof, Alice validates the proof, Alice recieves a positive result', () => {
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