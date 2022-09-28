//const verifier_artifact = require('./verifier.json')
//const Web3Utils = require('web3-utils');
//const contract = require('truffle-contract');
//const Web3 = require('web3');

//var Verifier = contract(verifier_artifact);
const verifyingProof = async (): Promise<String> => {
	// export const verifyProof = async (verifier_address: string, a: any,b: any,c: any, publicInputs:any) => {
	console.log("hello?");
	// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.PROVIDER));
	// console.log(web3);
	// const accounts = await web3.eth.getAccounts;
	// console.log("accounts",accounts);
	// Verifier.setProvider(web3.currentProvider);
	// console.log("provider", web3.currentProvider);
	// const deployed = await Verifier.at(verifier_address);
	// console.log("deployed", deployed);
	// const commitment = Web3Utils.sha3(Web3Utils.toHex(publicInputs));
	// console.log("commitment", commitment);
	// const res = await deployed.verifyAndPush.call(a, b, c, publicInputs, commitment, { from: accounts[0] });
	// console.log("res", res);
	// return res;
	return "function running?";
};
export default verifyingProof;
