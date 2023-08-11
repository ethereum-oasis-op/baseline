pragma circom 2.1.5;

include "../../../../../../node_modules/circomlib/circuits/comparators.circom";
include "./utils/ecdsaSignatureVerifier.circom";
include "./utils/merkleProofVerifier.circom";
include "./utils/arithmeticOperators.circom";

template Circuit(nodes){

	//Non-inclusion Merkle Proof inputs
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


	//1. merklizedInvoiceRoot is NOT part of stateTree
	component merkleProofVerifier = MerkleProofVerifier(nodes);
	merkleProofVerifier.leaf <== merkelizedInvoiceRoot;
	merkleProofVerifier.root <== stateTreeRoot;
	for(var n = 0; n < nodes; n++){
		merkleProofVerifier.pathElements[n] <== stateTree[n];
		merkleProofVerifier.pathIndices[n] <== stateTreeLeafPosition[n]; 
	} 
	
	var isMerkleProofVerified = merkleProofVerifier.verified;
	

	//2. Verify Signature
	component ecdsaSignatureVerifier = EcdsaSignatureVerifier();
	ecdsaSignatureVerifier.signature <== signature;
	ecdsaSignatureVerifier.publicKeyX <== publicKeyX;
	ecdsaSignatureVerifier.publicKeyY <== publicKeyY;
	ecdsaSignatureVerifier.Tx <== Tx;
	ecdsaSignatureVerifier.Ty <== Ty;
    	ecdsaSignatureVerifier.Ux <== Ux;
	ecdsaSignatureVerifier.Uy <== Uy;
	
	var isSignatureVerified = ecdsaSignatureVerifier.verified;


	component mul = Mul(2);
	mul.nums[0] <== isMerkleProofVerified;
	mul.nums[1] <== isSignatureVerified;

	isVerified <== mul.result;
	
}


//declaring the public inputs
component main {public [stateTreeRoot, publicKeyX, publicKeyY]}= Circuit(12);