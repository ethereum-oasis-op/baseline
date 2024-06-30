pragma circom 2.1.5;

include "../../../../../../node_modules/circomlib/circuits/comparators.circom";
include "../../../../../../node_modules/circomlib/circuits/eddsa.circom";
include "./utils/arithmeticOperators.circom";

template Workstep3(){

	signal input invoiceStatus;
	
	//Signature inputs
	signal input message[256];
    	signal input A[256];
   	signal input R8[256];
    	signal input S[256];

	signal output isVerified;


	//1. Status == PAID
	component statusVerifier = StatusVerifier();
	statusVerifier.invoiceStatus <== invoiceStatus;	
	var isStatusVerified = statusVerifier.verified; 
	
	
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


	component mul = Mul(2);
	mul.nums[0] <== isStatusVerified;
	mul.nums[1] <== isSignatureVerified;

	isVerified <== mul.result;
	
}

template StatusVerifier(){
	signal input invoiceStatus;
	
	signal output verified;

	//VERIFIED (as decimal utf-8 [80, 65, 73, 68])
	var status = 286; // status = 80 + 65 + 73 + 68

	component isStatusEqualPaid = IsEqual();

	isStatusEqualPaid.in[0] <== status;
	isStatusEqualPaid.in[1] <== invoiceStatus;	
	
	verified <== isStatusEqualPaid.out;

}



//declaring the public inputs
component main = Workstep3();