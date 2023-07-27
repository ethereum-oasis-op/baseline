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


	//Num2Bits 256
	
	//Concatenate bits
	//Sha256 on 512 bits
	//Bits to Num 256

	component hasher = MiMCSponge(2, 1);
	hasher.ins[0] <== left;
	hasher.ins[1] <== right;
	hasher.k <== 0;
	hash <== hasher.outs[0];
}

// if s == 0 returns [in[0], in[1]]
// if s == 1 returns [in[1], in[0]]
template DualMux() {
	signal input in[2];
	signal input s;
	signal output out[2];

	s * (1 - s) === 0
	out[0] <== (in[1] - in[0])*s + in[0];
	out[1] <== (in[0] - in[1])*s + in[1];
}

function concatenanteLeftRight(left, right){

	component numToBits

}

function numToBits(num) {
	var bits[256];
	component num2Bits = Num2Bits(256);
	num2Bits.in <== num;

	for(var i = 0; i < 256; i++){
		bits[i] <== num2Bits.out[i];
	}
}