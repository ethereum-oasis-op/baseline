pragma circom 2.1.5;

include "../../../../../../node_modules/circomlib/circuits/comparators.circom";
include "./ecdsaSignatureVerifier.circom";
include "./merkleProofVerifier.circom";

template Workstep1(){

	signal input invoiceStatus;
	signal input invoiceAmount;
	signal input items;
	signal input itemPrices[items];
	signal input itemAmount[items];
	
	//Non-inclusion Merkle Proof inputs
	signal input nodes;
	signal input merkelizedInvoiceRoot;
	signal input stateTreeRoot;
	signal input stateTree[nodes];
	signal input stateTreeLeafPosition[nodes];
	
	//Signature inputs
	signal input signature;
	signal input publicKeyX;
	signal input publicKeyY;
	signal input Tx;
	signal input Ty;
    	signal input Ux;
	signal input Uy;

	signal output isVerified;


	//1. Status == NEW	
	var isStatusVerified = verifyStatus(invoiceStatus);

	
	//2. InvoiceAmount == itemPrices * itemAmount	
	var isInvoiceAmountVerified = verifyAmount(items, invoiceAmount, itemPrices[items], itemAmount[items]);


	//3. merklizedInvoiceRoot is NOT part of stateTree
	var isMerkleProofVerified = verifyMerkleProof(nodes, merkelizedInvoiceRoot, stateTreeRoot, stateTree[nodes], stateTreeLeafPosition[nodes]);
	

	//4. Verify Signature
	var isSignatureVerified = verifySignature(signature, publicKeyX, publicKeyY, Tx, Ty, Ux, Uy);

	isVerified <== isStatusVerified * isInvoiceAmountVerified * isMerkleProofVerified * isSignatureVerified;
	
}

function verifyStatus(invoiceStatus){
	//NEW (as decimal utf-8 [78, 69, 87])
	var status = 234; // status= 78 + 69 + 87

	component isStatusEqualNew = IsEqual();

	isStatusEqualNew.in[0] <== status;
	isStatusEqualNew.in[1] <== invoiceStatus;	
	
	return isStatusEqualNew.out;

}

function verifyAmount(items, invoiceAmount, itemPrices, itemAmount){
	var totalItemAmount = 0;
	for(var i = 0; i < items; i++){
		totalItemAmount += itemPrices[i] * itemAmount[i]; 
	}

	component isItemAmountEqualInvoice = IsEqual();

	isItemAmountEqualInvoice.in[0] <== totalItemAmount;
	isItemAmountEqualInvoice.in[1] <== invoiceAmount;	
	
	return isItemAmountEqualInvoice.out;
}

function verifyMerkleProof(nodes, merkelizedInvoiceRoot, stateTreeRoot, stateTree, stateTreeLeafPosition){
	component merkleProofVerifier = MerkleProofVerifier(nodes);
	merkleProofVerifier.leaf <== merkelizedInvoiceRoot;
	merkleProofVerifier.root <== stateTreeRoot;
	for(var n = 0; n < nodes; n++){
		merkleProofVerifier.pathElements[n] <== stateTree[n];
		merkleProofVerifier.pathIndices[n] <== stateTreeLeafPosition[n]; 
	} 

	return merkleProofVerifier.isVerified;
}

function verifySignature(signature, publicKeyX, publicKeyY, Tx, Ty, Ux, Uy){
	component ecdsaSignatureVerifier = EcdsaSignatureVerifier();
	ecdsaSignatureVerifier.signature <== signature;
	ecdsaSignatureVerifier.publicKeyX <== publicKeyX;
	ecdsaSignatureVerifier.publicKeyY <== publicKeyY;
	ecdsaSignatureVerifier.Tx <== Tx;
	ecdsaSignatureVerifier.Ty <== Ty;
    	ecdsaSignatureVerifier.Ux <== Ux;
	ecdsaSignatureVerifier.Uy <== Uy;

	return ecdsaSignatureVerifier.isVerified;
}

//declaring the public inputs
component main = Workstep1();