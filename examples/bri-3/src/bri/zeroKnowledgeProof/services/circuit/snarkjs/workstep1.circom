pragma circom 2.1.2;

include "../../../../../../node_modules/circomlib/circuits/comparators.circom";
include "../../../../../../node_modules/circomlib/circuits/eddsa.circom";
include "./utils/arithmeticOperators.circom";

template Workstep1(items){
	signal input invoiceStatus;
	signal input invoiceAmount;
	signal input itemPrices[items];
	signal input itemAmount[items];

	//Signature inputs
	signal input message[256];
    	signal input A[256];
   	signal input R8[256];
    	signal input S[256];

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

	//3. Verify Eddsa signature
	var verifiedFlag = 0;
	component eddsaSignatureVerifier = EdDSAVerifier(256);
	for(var i = 0; i < 256; i++){
		eddsaSignatureVerifier.msg[i] <== message[i];
		eddsaSignatureVerifier.A[i] <== A[i];
		eddsaSignatureVerifier.R8[i] <== R8[i];
		eddsaSignatureVerifier.S[i] <== S[i];	
	}
	verifiedFlag = 1;
	component isEqualSignature = IsEqual();
	isEqualSignature.in[0] <== verifiedFlag;
	isEqualSignature.in[1] <== 1;
	var isSignatureVerified = isEqualSignature.out;	

	component mul = Mul(3);
	mul.nums[0] <== isStatusVerified;
	mul.nums[1] <== isInvoiceAmountVerified;
	mul.nums[2] <== isSignatureVerified;

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
component main = Workstep1(4);