//Define ZK circuit
//Compile ZK circuit
//[pk, vk] = setupZKCircuit()
//Deploy Verifier.sol
//constructor(vk)
//verify(proof, publicInput)
//verifyCircuit(proof, publicInput, this.vk) --> call the verifier contract deployed by gnark
//Deploy MerkleTree.sol
//constructor()
//insertNewLeaf()
//Deploy Shield.sol
//contructor()/
//if(verify(proof, publicInput) == true)
//insert new leaf into merkle tree (//getLeaves, getRoot) --> byte32 root = getRoot()

import { connectToBlockchain, compileContract, deployContract, getDeployedShieldContract } from "./lib/blockchain.js"
import { fs } from "fs";

export const deployShield = () => {

var web3 = await connectToBlockchain();

//compile and deploy Verifier contract
var verifierContractAbsolutePath = path.resolve("../../zkcircuits/ordercircuit/order.sol");
var compiledVerifierContract = compileContract("Verifier", verifierContractAbsolutePath);
var deployedVerifierContract = deployContract(compiledVerifierContract, web3.eth.defaultAccount)

//compile and deploy Shield contract
var shieldContractAbsolutePath = path.resolve("./contracts/Shield.sol");
var compiledShieldContract = compileContract("Shield", shieldContractAbsolutePath, [deployedVerifierContract.options.address])
var deployedShieldContract = deployContract(compiledShieldContract, web3.eth.defaultAccount)

//Store the compiled Shield contract to access it later.
fs.writeFile("./contracts/Shield.json", compiledShieldContract, err => {
	if (err) {
	  console.error(err)
	  return
	}
	//file written successfully
      })

}

export const verifyAndAddNewLeaf = async(uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input,
        bytes32 _newCommitment) => {

	var web3 = await connectToBlockchain();

	//Connect to deployed Shield Contract
	var shieldContract = await getDeployedShieldContract();
	var shieldContractAbi = shieldContract.abi;
	var shield = new web3.eth.Contract(shieldContractAbi, web3.eth.defaultAccount);

	//Call the verify method and add new leaf to Merkle tree
	var verified = await shield.methods.verifyAndPush(a, b, c, input, _newCommitment);

	return verified;
}
