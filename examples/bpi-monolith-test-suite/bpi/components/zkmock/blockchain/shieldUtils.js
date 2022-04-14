
import { connectToBlockchain, compileContract, deployContract, getDeployedShieldContract } from "./blockchain.js"
import { fs } from "fs";

const URL = "https://localhost:8080"

export const deployShield = async() => {

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

export const verifyAndAddNewLeaf = async(a, b, c, input, _newCommitment) => {

	var web3 = await connectToBlockchain();

	//Connect to deployed Shield Contract
	var shieldContract = await getDeployedShieldContract();
	var shieldContractAbi = shieldContract.abi;
	var shield = new web3.eth.Contract(shieldContractAbi, web3.eth.defaultAccount);

	//TODO: Convert input -> bytes32

	//Call the verify method and add new leaf to Merkle tree
	var verified = await shield.methods.verifyAndPush(a, b, c, input, _newCommitment);

	return verified;
}

export const getProof = async() => {
	const response = await fetch(URL, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({})
	      });
	return response.json();
}