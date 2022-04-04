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

import { contract } from "@truffle/contract";
import Web3 from "web3";
import Shield from "./build/Shield.json";

if (typeof web3 === "undefined") {
  var web3 = new Web3(new Web3.givenProvider());
} else {
  var web3 = new Web(new Web3.providers.HttpProvider("http://localhost:7545"));
}

web3.eth.defaultAccount = web3.eth.accounts[0];

const ShieldContract = new web3.eth.Contract(
  Shield.abi,
  web3.eth.defaultAccount
);

const verifyAndAddNewLeaf = async() => {
	await ShieldContract.methods.verifyAndPush()
}
