pragma circom 2.1.5;

include "../../../../../../node_modules/circomlib/circuits/comparators.circom";

template circuit(){

	//Following is placeholder code: Checking if inputA == inputB
	//TODO: Add circuit constraints
	signal input inputValueA;
	signal input inputValueB;  
	signal output outputValue;

	component isEqual = IsEqual();

	isEqual.in[0] <== inputValueA;
	isEqual.in[1] <== inputValueB; 

   	outputValue <== isEqual.out;
}

//declaring the public inputs
component main {public [inputValueA, inputValueB]} = circuit();