import { OrderAlt } from "./orderalt";
import { MerkleTree } from 'merkletreejs'
import * as sha256 from 'crypto-js/sha256';
import { Shield } from "./shield";
import { Verifier } from "./verifier";
import { placeOrderPredicate, placeOrderInput} from "./predicates";

export class AgreementAlt{

    productIds: string[];

    order: OrderAlt;

    proofs: string[] = [];

    buyerPK: string; // In practice: curve point

    sellerPK: string; // As above

    shield : Shield;
    
    verifiers : [];

    // Sets initial aggreement state (counterparty  public keys, product ids) and deploys shield + verifier contracts
    constructor(sellerPK: string,buyerPK: string,productIds: string[]){
        this.productIds = productIds;
        this.buyerPK = buyerPK;
        this.sellerPK = sellerPK;
    }

    public deployShield(): void{
        let [agreementStateTree,,] = this.merkleizeState();
        let agreementStateRoot = agreementStateTree.getRoot()
        let agreementStateCommitment = Buffer.from(sha256(
            agreementStateRoot +'salt'
            ).toString(),'hex');
        this.shield = new Shield('shield',agreementStateCommitment,this.sellerPK)
        let placeOrderVerifier = new Verifier(placeOrderPredicate)
        this.shield.addVerifier('placeOrder',placeOrderVerifier,this.sellerPK)
    }


    private verifySig(m: string,s: string,pk: string): boolean{
        // Mock
        return s === m+pk;
    }
    // Example of a workstep/functional requirement
    // - Checks order (our transacted State Object) is valid against current agreement state on BPI
    // - Generates commitment to order
    // - Produces data needed for verifier to check order commitment is valid w.r.t. committed aggreement state (stored on-chain)
    // (note: this data is our (obviously not ZK) proof)
    // - Calls shield contract to verify proof of order commitment validity 
    // (note: aggreement state is recorded on-chain so only state object commitment and "proof" are sent)
    placeOrder(order: OrderAlt) : boolean{
        // Check order against BPI Agreement state
        if (this.shield === undefined){
            throw "shield undefined"
        }
        if (this.order !== undefined){
            throw "order already placed"
        }
        let sigValid = this.verifySig(order.productId,order.buyerSig,this.buyerPK);
        if (!sigValid){
            throw "invalid signature"
        }
        let idValid = this.productIds.includes(order.productId);
        if (!idValid){
            throw "invalid productid"
        }
        //  Gen
        let [
            agreementStateTree,
            productTree,
            _
        ] : [MerkleTree,MerkleTree,MerkleTree]
        = this.merkleizeState();
        // private inputs contain all information to validate new state object and calculate new agreement root
        let privateInputs = {
            order: order,
            orderSalt: 'salt',
            productIdsRoot: productTree.getRoot(),
            productIdsProof: productTree.getProof(sha256(order.productId)),
            buyerPK: this.buyerPK,
            sellerPK: this.sellerPK,
            agreementStateRoot: agreementStateTree.getRoot(),
            agreementStateSalt: 'salt',
            salt: 'salt'
        }
        // Generate order commitment
        let orderCommitment = this.genOrderCommitment(order)
        // Verify "proof" on-chain
        if (this.shield.executeWorkstep('placeOrder',orderCommitment,privateInputs) === true){
            this.order = order;
            return true
        }
        // Add order to Agreement State on BPI
        else{
            return false 
        }
    }   

    // Helper: turns current aggreement state into merkle tree object for commitments/ZKP
    merkleizeState(): [MerkleTree,MerkleTree,MerkleTree] {
        let productLeaves = this.productIds.map(sha256);
        let productTree = new MerkleTree(productLeaves, sha256);
        if (this.order === undefined){
            var orderLeaves = [];
        }
        else {
            var orderLeaves = Object.entries(this.order).map(x => sha256(x[1]));
        }
        let orderTree = new MerkleTree(orderLeaves,sha256);
        let leaves = [
            this.buyerPK,
            this.sellerPK,
            productTree.getRoot(),
            orderTree.getRoot()]
        let agreementStateTree = new MerkleTree(leaves,sha256);
        return [agreementStateTree,productTree,orderTree]
    }
    // public for testing
    genOrderCommitment(order: OrderAlt): Buffer {
        let orderLeaves = Object.entries(order).map(x => sha256(x[1]));
        let orderTree = new MerkleTree(orderLeaves,sha256);
        let orderRoot = orderTree.getRoot();
        let orderCommitment = Buffer.from(sha256(orderRoot+'salt').toString(),'hex')
        return orderCommitment
    }

}