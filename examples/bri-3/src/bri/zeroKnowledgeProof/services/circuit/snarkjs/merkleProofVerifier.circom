pragma circom 2.1.5;

include "../../../../../../node_modules/circomlib/circuits/sha256/sha256.circom";
include "../../../../../../node_modules/circomlib/circuits/bitify.circom";

template MerkleProofVerifier(nodes){
	signal input leaf;
   	signal input root;
    	signal input pathElements[nodes];
    	signal input pathIndices[nodes];

	signal output isVerified;

	component selectors[levels];
    	component hashers[levels];

	for (var i = 0; i < levels; i++) {
		selectors[i] = DualMux();
		selectors[i].in[0] <== i == 0 ? leaf : hashers[i - 1].hash;
		selectors[i].in[1] <== pathElements[i];
		selectors[i].s <== pathIndices[i];

		hashers[i] = HashLeftRight();
		hashers[i].left <== selectors[i].out[0];
		hashers[i].right <== selectors[i].out[1];
	}

	root === hashers[levels - 1].hash;
	
}

// Computes Sha256([left, right])
template HashLeftRight() {
	signal input left;
	signal input right;
	signal output hash;

	var concatenatedBits[512] = concatenateLeftRight(left, right);
	
	var hashedBits[256];
	component hasher = Sha256(512);

	for(var i = 0; i < 512; i++){
		hasher.in[i] <== concatenatedBits[i];
	}	

	for(var i = 0; i < 256; i++){
		hashedBits[i] <== hasher.outs[i];
	}

	hash <== bitsToNum(hashedBits);		
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

function concatenateLeftRight(left, right){

	var leftBits[256] = numToBits(left);
	var rightBits[256] = numToBits(right);

	var result[512];

	for(var i = 0; i < 512; i++){
		if(i < 256){
			result[i] = leftBits[i];
		}else{
			result[i] = rightBits[i-256];
		}
	}

	return result;
}

function numToBits(num) {
	var bits[256];
	component numToBits = Num2Bits(256);
	numToBits.in <== num;

	for(var i = 0; i < 256; i++){
		bits[i] = numToBits.out[i];
	}

	return bits;
}

function bitsToNum(bits) {
	var num;
	component bitsToNum = Bits2Num(256);
	for(var i = 0; i < 256; i++){
		bitsToNum.in[i] <== bits[i];
	}
	num = bitsToNum.out;

	return num;
}