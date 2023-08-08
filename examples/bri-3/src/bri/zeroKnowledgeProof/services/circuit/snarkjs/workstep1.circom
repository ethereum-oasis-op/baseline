pragma circom 2.1.5;

include "../../../../../../node_modules/circomlib/circuits/comparators.circom";
include "./ecdsaSignatureVerifier.circom";
include "./merkleProofVerifier.circom";
include "./utils/arithmeticOperators.circom";

template Workstep1(items, nodes){

	signal input invoiceStatus;
	signal input invoiceAmount;
	signal input itemPrices[items];
	signal input itemAmount[items];
	
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


	//1. Status == NEW
	component statusVerifier = StatusVerifier();
	statusVerifier.invoiceStatus <== invoiceStatus;	
	var isStatusVerified = statusVerifier.verified; 

	
	//2. InvoiceAmount == itemPrices * itemAmount
	component amountVerifier = AmountVerifier(items);
	amountVerifier.invoiceAmount <== invoiceAmount;
	for(var i = 0; i < items; i++){
		amountVerifier.itemPrices[i] <== itemPrices[i];
		amountVerifier.itemAmount[i] <== itemAmount[i];
	}

	var isInvoiceAmountVerified = amountVerifier.verified;


	//3. merklizedInvoiceRoot is NOT part of stateTree
	component merkleProofVerifier = MerkleProofVerifier(nodes);
	merkleProofVerifier.leaf <== merkelizedInvoiceRoot;
	merkleProofVerifier.root <== stateTreeRoot;
	for(var n = 0; n < nodes; n++){
		merkleProofVerifier.pathElements[n] <== stateTree[n];
		merkleProofVerifier.pathIndices[n] <== stateTreeLeafPosition[n]; 
	} 
	
	var isMerkleProofVerified = merkleProofVerifier.verified;
	

	//4. Verify Signature
	component ecdsaSignatureVerifier = EcdsaSignatureVerifier();
	ecdsaSignatureVerifier.signature <== signature;
	ecdsaSignatureVerifier.publicKeyX <== publicKeyX;
	ecdsaSignatureVerifier.publicKeyY <== publicKeyY;
	ecdsaSignatureVerifier.Tx <== Tx;
	ecdsaSignatureVerifier.Ty <== Ty;
    	ecdsaSignatureVerifier.Ux <== Ux;
	ecdsaSignatureVerifier.Uy <== Uy;
	
	var isSignatureVerified = ecdsaSignatureVerifier.verified;


	component mul = Mul(4);
	mul.nums[0] <== isStatusVerified;
	mul.nums[1] <== isInvoiceAmountVerified;
	mul.nums[2] <== isMerkleProofVerified;
	mul.nums[3] <== isSignatureVerified;

	isVerified <== mul.result;
	
}

template StatusVerifier(){
	signal input invoiceStatus;
	
	signal output verified;

	//NEW (as decimal utf-8 [78, 69, 87])
	var status = 234; // status= 78 + 69 + 87

	component isStatusEqualNew = IsEqual();

	isStatusEqualNew.in[0] <== status;
	isStatusEqualNew.in[1] <== invoiceStatus;	
	
	verified <== isStatusEqualNew.out;

}

template AmountVerifier(items){
	signal input invoiceAmount;
	signal input itemPrices[items];
	signal input itemAmount[items];

	signal output verified;

	component add = Add(items);
	for(var i = 0; i < items; i++){
		add.nums[i] <== itemPrices[i] * itemAmount[i]; 
	}

	component isItemAmountEqualInvoice = IsEqual();

	isItemAmountEqualInvoice.in[0] <== invoiceAmount;
	isItemAmountEqualInvoice.in[1] <== add.result;	
	
	verified <== isItemAmountEqualInvoice.out;
}

//declaring the public inputs
component main = Workstep1(50, 100);