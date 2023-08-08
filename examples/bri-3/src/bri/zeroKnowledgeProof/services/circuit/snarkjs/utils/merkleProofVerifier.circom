pragma circom 2.1.5;

include "../../../../../../node_modules/circomlib/circuits/sha256/sha256.circom";
include "../../../../../../node_modules/circomlib/circuits/comparators.circom";
include "../../../../../../node_modules/circomlib/circuits/bitify.circom";

template MerkleProofVerifier(nodes){
	signal input leaf;
   	signal input root;
    	signal input pathElements[nodes];
    	signal input pathIndices[nodes];

	signal output verified;

	component selectors[nodes];
    	component hashers[nodes];

	for (var i = 0; i < nodes; i++) {
		selectors[i] = DualMux();
		selectors[i].in[0] <== i == 0 ? leaf : hashers[i - 1].hash;
		selectors[i].in[1] <== pathElements[i];
		selectors[i].s <== pathIndices[i];

		hashers[i] = HashLeftRight();
		hashers[i].left <== selectors[i].out[0];
		hashers[i].right <== selectors[i].out[1];
	}

	component isRootHashEqual = IsEqual();
	isRootHashEqual.in[0] <== root;
	isRootHashEqual.in[1] <== hashers[nodes - 1].hash;	
	
	verified <== isRootHashEqual.out;
	
}

// Computes Sha256([left, right])
template HashLeftRight() {
	signal input left;
	signal input right;
	signal output hash;

	component concatenateLeftRight = ConcatenateLeftRight();
	concatenateLeftRight.left <== left;
	concatenateLeftRight.right <== right;	

	component hasher = Sha256(512);
	component bitsToNum = BitsToNum();

	for(var i = 0; i < 512; i++){
		hasher.in[i] <== concatenateLeftRight.result[i];
	}		

	for(var i = 0; i < 256; i++){
		bitsToNum.bits[i] <== hasher.out[i];
	}

	hash <== bitsToNum.num;		
}

// if s == 0 returns [in[0], in[1]]
// if s == 1 returns [in[1], in[0]]
template DualMux() {
	signal input in[2];
	signal input s;
	signal output out[2];

	s * (1 - s) === 0;
	out[0] <== (in[1] - in[0])*s + in[0];
	out[1] <== (in[0] - in[1])*s + in[1];
}

template ConcatenateLeftRight(){
	signal input left;
	signal input right;
	signal output result[512];

	component leftNumToBits = NumToBits();
	leftNumToBits.num <== left;

	component rightNumToBits = NumToBits();	
	rightNumToBits.num <== right;

	for(var i = 0; i < 512; i++){
		if(i < 256){
			result[i] <== leftNumToBits.bits[i];
		}else{
			result[i] <== rightNumToBits.bits[i-256]; 
		}
	}
}

template NumToBits() {
	signal input num;
	signal output bits[256];
	component numToBits = Num2Bits(256);
	numToBits.in <== num;

	for(var i = 0; i < 256; i++){
		bits[i] <== numToBits.out[i];
	}
}

template BitsToNum() {
	signal input bits[256];
	signal output num;
	component bitsToNum = Bits2Num(256);
	for(var i = 0; i < 256; i++){
		bitsToNum.in[i] <== bits[i];
	}
	num <== bitsToNum.out;
}