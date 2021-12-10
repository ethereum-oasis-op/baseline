import { OrderAlt } from "./orderalt";
import { MerkleTree } from 'merkletreejs'
import sha256 from 'crypto-js/sha256';
import { Shield } from "./shield";
import { Verifier } from "./verifier";
import { placeOrderPredicate } from "./predicates";

export class AgreementAlt{

    productIds: string[];

    order: OrderAlt;

    proofs: string[] = [];

    buyerPK: string; // In practice: curve point

    sellerPK: string; // As above

    shield : Shield;
    
    verifiers : [];

    constructor(buyerPK: string,sellerPK: string,productIds: string[]){
        this.productIds = productIds;
        this.buyerPK = buyerPK;
        this.sellerPK = sellerPK;
        let [agreementStateTree,,] = this.merkleizeState();
        let agreementStateCommitment = sha256(
            agreementStateTree.getRoot(),
            'salt'
            );
        this.shield = new Shield('shield',this.merkleizeState()[0].getRoot(),"anon")
        let placeOrderVerifier = new Verifier(placeOrderPredicate)
        this.shield.addVerifier('placeOrder',placeOrderVerifier,sellerPK)
    }

    private verifySig(m: string,s: string,pk: string): boolean{
        // Mock
        return s === pk;
    }

    placeOrder(order: OrderAlt){
        let noOrder = this.order === undefined;
        let sigValid = this.verifySig(order.productId,order.buyerSig,this.buyerPK);
        let idValid = order.productId in this.productIds;
        if (noOrder && sigValid && idValid){
            let [
                agreementStateTree,
                productTree,
                _
            ] : [MerkleTree,MerkleTree,MerkleTree]
            = this.merkleizeState();
            
            this.shield.executeWorkstep('placeOrder')
            this.order = order;
                  
        }
                 
    }   
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

}