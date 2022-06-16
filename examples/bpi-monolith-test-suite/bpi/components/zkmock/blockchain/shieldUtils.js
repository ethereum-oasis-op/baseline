import {
  connectToBlockchain,
  compileContract,
  deployContract,
  getDeployedShieldContractABI,
  getDeployedShieldContractAddress,
} from "./blockchain";
import { fs } from "fs";

const URL = "https://localhost:8080";

export const deployShield = async () => {
  var web3 = await connectToBlockchain();

  //compile and deploy Verifier contract
  var verifierContractAbsolutePath = path.resolve(
    "../../zkcircuits/ordercircuit/order.sol"
  );
  var compiledVerifierContract = compileContract(
    "Verifier.sol",
    verifierContractAbsolutePath
  );
  var deployedVerifierContract = deployContract(
    compiledVerifierContract,
    web3.eth.defaultAccount
  );

  //compile and deploy Shield contract
  var shieldContractAbsolutePath = path.resolve("./contracts/Shield.sol");
  var compiledShieldContract = compileContract(
    "Shield.sol",
    shieldContractAbsolutePath
  );
  var deployedShieldContract = deployContract(
    compiledShieldContract,
    web3.eth.defaultAccount,
    [deployedVerifierContract.options.address]
  );

  //Store the compiled Shield contract to access it later.
  fs.writeFile("./contracts/Shield.json", compiledShieldContract, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    //file written successfully
  });

  //Store the address of deployed Shield contract
  var shieldAddress = JSON.parse({
    shieldAddress: deployedShieldContract.options.address,
  });
  fs.writeFile("./contracts/ShieldAddress.json", shieldAddress, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    //file written successfully
  });
};

export const verifyAndAddNewLeaf = async (proof, input, _newCommitment) => {
  var web3 = await connectToBlockchain();

  //Connect to deployed Shield Contract
  var shieldContractABI = (await getDeployedShieldContractABI()).abi;
  var shieldContractAddress = await getDeployedShieldContractAddress();
  var shield = new web3.eth.Contract(shieldContractABI, shieldContractAddress);

  //Groth16 Proof variables
  var ar = proof["Ar"];
  var krs = proof["Krs"];
  var bs = proof["Bs"];

  var a = [ar["X"], ar["Y"]];
  var b = [
    [bs["X"]["A0"], bs["X"]["A1"]],
    [bs["Y"]["A0"], bs["Y"]["A1"]],
  ];
  var c = [krs["X"], krs["Y"]];

  //Call the verify method and add new leaf to Merkle tree
  var verified = await shield.methods.verifyAndPush(
    a,
    b,
    c,
    input,
    _newCommitment
  );

  return verified;
};

export const getProof = async () => {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  return response.json();
};
