pragma circom 2.1.5;

template circuit(){
	signal input inputValue;

	signal output outputValue;

	outputValue <== inputValue;

}

component main = circuit();