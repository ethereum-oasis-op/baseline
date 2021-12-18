import { OrderAlt } from "./orderalt";
import sha256 = require( 'crypto-js/sha256' );
import {isDeepStrictEqual} from 'util'
import { MerkleTree } from 'merkletreejs'
import { networkInterfaces } from "os";

export type input = {
    agreementStateCommitment: Buffer;
    stateObjectCommitment: Buffer;
}
export type placeOrderInput = {
    order: OrderAlt,
    orderSalt: string,
    productIdsRoot: Buffer,
    productIdsProof: any[],
    buyerPK: string,
    sellerPK: string
    agreementStateRoot: Buffer,
    agreementStateSalt: string
    salt: string
}
function verifySig(m: string,s: string,pk: string): boolean{
    // Mock
    return s === m+pk;
}

export function placeOrderPredicate(input: input, privateInput: placeOrderInput): Buffer {
    let valid = true;
    // Validate commitments
    let agreementStateCommitment = Buffer.from(sha256(
        privateInput.agreementStateRoot+
        privateInput.agreementStateSalt
    ).toString(),'hex')
    valid &&= isDeepStrictEqual(
        input.agreementStateCommitment,
        agreementStateCommitment
    )
    let orderLeaves = Object.entries(privateInput.order).map(x => sha256(x[1]));
    let orderRoot = (new MerkleTree(orderLeaves,sha256)).getRoot();
    valid &&= isDeepStrictEqual(
        input.stateObjectCommitment,
        Buffer.from(sha256(
            orderRoot+
            privateInput.orderSalt
        ).toString(),'hex')
    )
    // Validate private inputs
    let agreementLeaves = [
        privateInput.buyerPK,
        privateInput.sellerPK,
        privateInput.productIdsRoot,
        Buffer.from('')
    ]
    let calculatedAgreementTree = new MerkleTree(agreementLeaves,sha256);
    let calculatedAgreementRoot = calculatedAgreementTree.getRoot();
    valid &&= isDeepStrictEqual(
        calculatedAgreementRoot,
        privateInput.agreementStateRoot
    )
    // Validate order signature
    valid &&= verifySig(
        privateInput.order.productId,
        privateInput.order.buyerSig,
        privateInput.buyerPK
    )
    // Validate order productId
    valid &&= MerkleTree.verify(
        privateInput.productIdsProof,
        sha256(privateInput.order.productId).toString(),
        privateInput.productIdsRoot
    )
    if (valid) {
        // Calculate and return merkle root of new agreement state
        let leaves = [
            privateInput.buyerPK,
            privateInput.sellerPK,
            privateInput.productIdsRoot,
            orderRoot
        ]
        let newAgreementStateTree = new MerkleTree(leaves,sha256);
        let newAgreementStateRoot = newAgreementStateTree.getRoot();
        let newAgreementStateCommitment = Buffer.from(sha256(
            newAgreementStateRoot+
            privateInput.salt
        ).toString(),'hex')
        return newAgreementStateCommitment
        
    }
    else{
        throw "Invalid proof"
    }


}