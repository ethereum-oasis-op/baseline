import { expect } from "chai";
import { AgreementAlt } from "../bpi/agreementalt";
import { MerkleTree } from 'merkletreejs'
import { OrderAlt } from "../bpi/orderalt";
import sha256 = require( 'crypto-js/sha256' );
import { Shield } from "../bpi/shield";

describe('ZK agreement behaviour', () => {
    it('Bob places a valid order, it is added to the bpi and the committed state reflects the new BPI agreement state.',() => {
        // Initialize
        const agreement = new AgreementAlt("alice","bob",["cup1","plate2"]);
        const order = new OrderAlt("cup1","cup1"+"bob")
        agreement.deployShield();
        const shield = agreement.shield;
        const oldCommit = shield.agreementStateCommitment
        // Act/Check 
        expect(agreement.placeOrder(order)).to.be.true
        const stateRoot = agreement.merkleizeState()[0].getRoot()
        const stateCommit = Buffer.from(sha256(stateRoot+'salt').toString(),'hex')
        //// Commitment in shield contract matches that caluclated from BPI agreement state
        expect(shield.agreementStateCommitment).to.be.eql(stateCommit)
        expect(shield.agreementStateCommitment).not.to.be.eql(oldCommit)
    });
    it('Bob places an order with an invalid product id, bpi and contract state remains unchanged',() => {
        // Initialize
        const agreement = new AgreementAlt("alice","bob",["cup1","plate2"]);
        const order = new OrderAlt("bowl1","bowl1"+"bob")
        agreement.deployShield();
        // Store
        const shield = agreement.shield;
        const stateRoot = agreement.merkleizeState()[0].getRoot()
        const stateCommit = Buffer.from(sha256(stateRoot+'salt').toString(),'hex')
        // Act/Check state unchanged/error thrown
        expect(() => agreement.placeOrder(order)).to.throw("invalid productid")
        expect(shield.agreementStateCommitment).to.be.eql(stateCommit)
    });
    it('Cannot verify invalid proof onchain',() => {
        const agreement = new AgreementAlt("alice","bob",["cup1","plate2"]);
        const order = new OrderAlt("cup1","cup1"+"notbob")
        agreement.deployShield();
        const shield = agreement.shield;
        let [
            agreementStateTree,
            productTree,
            _
        ] : [MerkleTree,MerkleTree,MerkleTree]
        = agreement.merkleizeState();
        // private inputs contain all information to validate new state object and calculate new agreement root
        let privateInput = {
            order: order,
            orderSalt: 'salt',
            productIdsRoot: productTree.getRoot(),
            productIdsProof: productTree.getProof(sha256(order.productId).toString()),
            buyerPK: agreement.buyerPK,
            sellerPK: agreement.sellerPK,
            agreementStateRoot: agreementStateTree.getRoot(),
            agreementStateSalt: 'salt',
            salt: 'salt'
        }
        let orderLeaves = Object.entries(order).map(x => sha256(x[1]));
        let orderTree = new MerkleTree(orderLeaves,sha256);
        let orderRoot = orderTree.getRoot();
        let orderCommitment = Buffer.from(sha256(orderRoot+'salt').toString(),'hex')
        let input = {
            agreementStateCommitment : shield.agreementStateCommitment,
            stateObjectCommitment : orderCommitment
        }
        expect(() => shield.verifiers['placeOrder'].predicate(input,privateInput)).to.throw("Invalid proof")
    });

});