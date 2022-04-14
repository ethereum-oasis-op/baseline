import { solc } from "solc";
import { fs } from "fs";
import { Web3 } from "web3";
import { dotenv } from "dotenv";

dotenv.config();

export const connectToBlockchain = async() => {
  if (typeof web3 === "undefined") {
    var web3 = new Web3(new Web3.givenProvider());
  } else {
    var web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:7545")
    );
  }

  web3.eth.defaultAccount = web3.eth.accounts[0];
  
  return web3;
};

export const compileContract = async(contractName, _contractPath) => {
  const contractPath = _contractPath;
  const contractSourceCode = fs.readFileSync(contractPath, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "test.sol": {
        content: contractSourceCode,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const inputString = JSON.stringify(input);
  const output = solc.compile(inputString);
  const outputJSON = JSON.parse(output);
  const compiledContract = outputJSON.contracts["test.sol"][contractName];
  return compiledContract;
};

export const deployContract = async (compiledContract, address, params) => {
  const contractAbi = compiledContract.abi;
  const contractBytecode = "0x" + compiledContract.evm.bytecode.object;
  const contract = await new web3.eth.Contract(contractAbi)
    .deploy({
      data: contractBytecode,
      arguments: null || params,
    })
    .send({
      from: address,
      gas: "1000000",
    });
  provider.engine.stop();
  return contract;

  //IMPROVEMENT: In case the transaction needs to be signed.
  /* const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: address,
      data: contract.encodeABI(),
      gas: "1000000",
    },
    process.env.WALLET_PRIVATE_KEY
  );

  const txHash = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  return txHash;*/
};

export const getDeployedShieldContract = async() => {

  //Read the compiled Shield.json file
  var rawShieldData = fs.readFileSync('../contracts/Shield.json');
  var shieldContract = JSON.parse(rawShieldData);
  return shieldContract;
}