import { ethers, Wallet } from "ethers";
import axios from 'axios';
import shell from 'shelljs';
import { logger } from "../logger";
import dotenv from "dotenv";

import { concatenateThenHash } from "../merkle-tree/hash";
import shieldContract from "../contracts/artifacts/Shield.json";

dotenv.config();

const commitMgrEndpoint = "http://localhost:4001/jsonrpc";
const commitMgrServerUrl = "http://localhost:4001";

export const web3provider = new ethers.providers.JsonRpcProvider(commitMgrEndpoint);
export const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, web3provider);
export const txManager = process.env.ETH_CLIENT_TYPE;

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const waitRelayTx = async function (relayTxHash) {
  let mined = false
  while (!mined) {
    const statusResponse = await web3provider.send('relay_getTransactionStatus', [
      relayTxHash
    ]);

    for (let i = 0; i < statusResponse.length; i++) {
      const hashes = statusResponse[i]
      const receipt = await web3provider.getTransactionReceipt(hashes.ethTxHash)
      if (receipt && receipt.confirmations && receipt.confirmations > 1) {
        mined = true
        return receipt
      }
    }
    await sleep(1000)
  }
}

export const deposit = async function () {
  const tx = await wallet.sendTransaction({
    // This is the ITX PaymentDeposit contract address for Rinkeby
    //to: '0x015C7C7A7D65bbdb117C573007219107BD7486f9',
    // This is the ITX PaymentDeposit contract address for Goerli
    to: '0xE25118a1d97423c5a5454c43C5013dd169de2518',
    // Choose how much ether you want to deposit in the ITX gas tank
    value: ethers.utils.parseUnits('1.0', 'ether')
  })

  // Waiting for the transaction to be mined
  await tx.wait()
}

export const getBalance = async function () {
  const balance = await web3provider.send('relay_getBalance', [wallet.address]);
  return balance;
}

export const switchChain = async (network) => {

  const result = network === 'local' ? shell.exec('cp .env.localdev .env') : shell.exec('cp .env.network .env') ;
  // Run external tool synchronously
  if (result.code !== 0) {
      shell.echo('Error: Switch chain failed');
      shell.exit(1);
  }

  return result;
}

export const deployContracts = async (sender, verifierContractAddress, network, saveContract, saveCommiment) => {
let txHash;
let shieldContractAddress;
let treeHeight = 2;

let contractInfo;
if (verifierContractAddress === undefined){
const verifierAddress = await axios.post(`${commitMgrServerUrl}/deploy-verifier-contract`, {
    contractName: "Verifier.sol",
    deployedNetwork: network,
    sender: sender
  })
  .then( (response) => {
      //access the resp here....
      logger.debug(`Deploy: ${response.data}`);
      return response.data;
  })
  .then (async (txVerifierHash) => {
    logger.debug(`Tx Verifier Hash: ${txVerifierHash}`);
    return await axios.post(process.env.ETH_CLIENT_HTTP, {
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      params: [txVerifierHash],
      id: 1
    })
    .then( (eth_response) => {
      //access the resp here....
    const result = eth_response.data;
    //Alert('success', 'Settings saved...', 'Settings saved with success into .env file..');
    logger.info(`Verifier Contract Address: ${result.result.contractAddress}`);

    contractInfo = {
        name: 'Verifier.sol', // Contract name
        network: network, // Contract network
        blockNumber: result.result.blockNumber, // Last interation block number
        txHash: txVerifierHash, // Tx Hash
        address: result.result.contractAddress, // contract address
        active: true
    }
    saveContract(contractInfo);
    return result.result.contractAddress;
  })
  .catch((error) => {
    logger.error(error);
    //Alert('error', 'ERROR...', "OOPS that didn't work :(");
  });

  })
  .catch((error) => {
      logger.error(error);
      //Alert('error', 'ERROR...', "OOPS that didn't work :(");
  });

    verifierContractAddress = verifierAddress;
  }

//############### Deploy Shield.sol contract: eth_sendRawTransaction
let nonce = await wallet.getTransactionCount();
const abiCoder = new ethers.utils.AbiCoder();
logger.debug('Verifier Address: ', verifierContractAddress);
// Encode the constructor parameters, then append to bytecode
const encodedParams = abiCoder.encode(["address", "uint"], [verifierContractAddress, treeHeight]);
const bytecodeWithParams = shieldContract.bytecode + encodedParams.slice(2).toString();
const unsignedTx = {
  from: sender,
  data: bytecodeWithParams,
  nonce,
  gasLimit: 0
};

let gasEstimate = await wallet.estimateGas(unsignedTx);
unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);

const tx = await wallet.sendTransaction(unsignedTx);
await tx.wait();
txHash = tx.hash;

//################## Retrieve Shield.sol tx receipt
const txDetails = await axios.post(`${commitMgrServerUrl}/jsonrpc`, {
  jsonrpc: "2.0",
  method: "eth_getTransactionReceipt",
  params: [txHash],
  id: 1,
  })
  .then((response) => {
      //access the resp here....
      logger.debug(`Shield Contract Address : ${response.data.result.contractAddress}`);
      shieldContractAddress = response.data.result.contractAddress;
      contractInfo = {
          name: 'Shield.sol', // Contract name
          network: network, // Contract network
          blockNumber: response.data.result.blockNumber, // Last interation block number
          txHash: txHash, // Tx Hash
          address: response.data.result.contractAddress, // contract address
          active: true
      }
      saveContract(contractInfo);

      return response.data.result;
  })
  .catch((error) => {
      logger.error(error);
      return false;
  });

//#################### Counterparty sends 1st leaf into untracked Shield contract
  nonce = await wallet.getTransactionCount();
  const proof = [5];
  const publicInputs = ["0xc2f480d4dda9f4522b9f6d590011636d904accfe59f12f9d66a0221c2558e3a2"]; // Sha256 hash of new commitment
  const newCommitment = "0xda9f452dccccccccccccccccccccccccccccccccccccccccccccccccccccc799";

  const shieldInterface = new ethers.utils.Interface(shieldContract.abi);
  const txData = shieldInterface.encodeFunctionData(
    "verifyAndPush(uint256[],uint256[],bytes32)",
    [proof, publicInputs, newCommitment]
  );

  const unsignedLeafTx = {
    to: shieldContractAddress,
    from: sender,
    data: txData,
    nonce,
    gasLimit: 0
  };

  gasEstimate = await wallet.estimateGas(unsignedLeafTx);
  unsignedLeafTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);

  const txLeaf = await wallet.sendTransaction(unsignedLeafTx);
  await txLeaf.wait();

  const txReceipt = await web3provider.getTransactionReceipt(txLeaf.hash);

  if (network === 'local') {
    // Save commitment to db if network is local
    let newCommit = {
      commitHash: publicInputs[0], // Sha256 hash of new commitment
      commitment: newCommitment, // did network
      network: 'local' // always local network *TODO
    }
    await saveCommiment(newCommit);
  }

  logger.debug(`TX Receipt Contract Address: ${txReceipt.txHash}`);
  logger.debug(`TX Receipt Status: ${txReceipt.status}`);

//################## Baseline_track should initiate merkle tree in db
const initiateMerkle = await axios.post(`${commitMgrServerUrl}/jsonrpc`, {
  jsonrpc: "2.0",
  method: "baseline_track",
  params: [shieldContractAddress],
  id: 1,
  })
  .then((response) => {
      //access the resp here....
      logger.debug(`Baseline Track : ${response.data.result}`);
      return response.data.result;
  })
  .catch((error) => {
      logger.error(error);
      return false;
  });

  logger.debug(`Initiate Merkle Tree Status: ${initiateMerkle}`);

//#################### Baseline_getCommit should detect 1st leaf already in tree
const leafIndex = 0;
const baselineGetCommit = await axios.post(`${commitMgrServerUrl}/jsonrpc`, {
  jsonrpc: "2.0",
  method: "baseline_getCommit",
  params: [shieldContractAddress, leafIndex],
  id: 1,
  })
  .then((response) => {
      //access the resp here....
      const merkleNode = response.data.result;
      let leafValue = merkleNode.hash;
      logger.debug(`Baseline Leaf Value : ${leafValue}`);
      return response.data.result;
  })
  .catch((error) => {
      logger.error(error);
      return false;
  });

  logger.debug(`Baseline_getCommit should detect 1st leaf already in tree: ${baselineGetCommit.txHash}`);

  //###################### baseline_getRoot returns root hash
  const baselineGetRoot = await axios.post(`${commitMgrServerUrl}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "baseline_getRoot",
    params: [shieldContractAddress],
    id: 1,
    })
    .then((response) => {
        //access the resp here....
        const rootHash = response.data.result;
        logger.debug(`Baseline Root Hash : ${rootHash}`);
        return response.data.result;
    })
    .catch((error) => {
        logger.error(error);
        return false;
    });

  //END run tests

  return true;
}

// Counterparty sends 1st leaf into untracked Shield contract
export const sendCommit = async (newCommitment, sender, shieldContractAddress, network, saveCommiment) => {
  const proof = [5];
  //const publicInputs = ["0x9f72ea0cf49536e3c66c787f705186df9a4378083753ae9536d65b3ad7fcddc4"]; // Sha256 hash of new commitment
  //const newCommitment = "0x8222222222222222222222222222222222222222222222222222222222222222";
  //const newCommitment = "0x7465737400000000000000000000000000000000000000000000000000000000
  logger.debug(`NETWORK >>> ${network}`)
  const newCommitHash = concatenateThenHash([newCommitment]);
  const publicInputs = [`${newCommitHash}`]; // Sha256 hash of new commitment
  let buffer = Buffer.alloc(32);
  //buffer.fill('0', 0, 32);
  buffer.write(newCommitment, "utf-8");
  buffer.fill('0', buffer.length, 32);
  const bufferCommitmentHash = Buffer.from(buffer);
  logger.debug(`newCommitmentHash: 0x${bufferCommitmentHash.toString('hex')}`);
  const newCommitmentHash = `0x${bufferCommitmentHash.toString('hex')}`;
  const sendCommitLeaf = await axios.post(`${commitMgrServerUrl}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "baseline_verifyAndPush",
    params: [sender, shieldContractAddress, proof, publicInputs, newCommitmentHash],
    id: 1,
    })
    .then( async (response) => {
        //access the resp here....
        const txHash = response.data.result.txHash;
        logger.debug(`Baseline Send Commit TxHash : ${txHash}`);

        if (network === 'local') {
          // Save commitment to db if network is local
          let newCommit = {
            commitHash: publicInputs[0], // Sha256 hash of new commitment
            commitment: newCommitmentHash, // did network
            network: 'local' // always local network *TODO
          }
          await saveCommiment(newCommit);
        }

        return response.data.result;
    })
    .catch((error) => {
        logger.error(error);
        return false;
    });

  //###################### baseline_getRoot returns root hash
  const baselineGetRoot = await axios.post(`${commitMgrServerUrl}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "baseline_getRoot",
    params: [shieldContractAddress],
    id: 1,
    })
    .then((response) => {
        //access the resp here....
        const rootHash = response.data.result;
        logger.debug(`Baseline Root Hash : ${rootHash}`);
        return response.data.result;
    })
    .catch((error) => {
        logger.error(error);
        return false;
    });

    return sendCommitLeaf;
}

// Counterparty sends 1st leaf into untracked Shield contract
export const sendFirstLeaf = async (sender, shieldContractAddress, network) => {
  let txReceipt;
  // const balance = await sendBaselineBalance(sender);
  const nonce = await wallet.getTransactionCount();
  const proof = [5];
  const publicInputs = ["0xc2f480d4dda9f4522b9f6d590011636d904accfe59f12f9d66a0221c2558e3a2"]; // Sha256 hash of new commitment
  const newCommitment = "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";

  const shieldInterface = new ethers.utils.Interface(shieldContract.abi);
  const txData = shieldInterface.encodeFunctionData(
    "verifyAndPush(uint256[],uint256[],bytes32)",
    [proof, publicInputs, newCommitment]
  );

  const unsignedTx = {
    to: shieldContractAddress,
    from: sender,
    data: txData,
    nonce,
    gasLimit: 0, // 1500000
    // gasPrice: gasPriceSet
  };

  const gasEstimate = await wallet.estimateGas(unsignedTx);
  unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);
  logger.debug(`gasEstimate: ${gasEstimate}`);
  const tx = await wallet.sendTransaction(unsignedTx);
  await tx.wait();

  txReceipt = await web3provider.getTransactionReceipt(tx.hash);

  return txReceipt;
}

//baseline_track should initiate merkle tree in db
export const sendBaselineBalance = async (senderAddress) => {

  return await axios.post(`${commitMgrServerUrl}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: [
      senderAddress,
      "latest"
    ],
    id: 1,
    })
    .then((response) => {
        //access the resp here....
        logger.debug(`Account Balance : ${response.data.result}`);
        return response.data.result;
    })
    .catch((error) => {
        logger.error(error);
        return error;
    });

}

//baseline_track should initiate merkle tree in db
export const sendBaselineTrack = async (contractAddress, network) => {

  return await axios.post(`${commitMgrServerUrl}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "baseline_track",
      params: [contractAddress],
      id: 1,
    })
    .then((response) => {
        //access the resp here....
        logger.debug(`Status baseline_track: ${response.data.result}`);
        return response.data.result;
    })
    .catch((error) => {
        logger.error(error);
        return error;
    });

}

//baseline_getTracked should return deployed contract
export const sendBaselineGetTracked = async () => {

  return await axios.post(`${commitMgrServerUrl}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "baseline_getTracked",
      params: [],
      id: 1,
    })
    .then((response) => {
        //access the resp here....
        logger.debug(`Status baseline_getTracked: ${response.data.result}`);
        return response.data.result;
    })
    .catch((error) => {
        logger.error(error);
        return error;
    });

}

//baseline_verifyAndPush creates 1st leaf
export const sendBaselineVerifyAndPush = async (sender, contractAddress, network) => {
  //let txReceipt;
  const proof = [5];
  const publicInputs = ["0x02d449a31fbb267c8f352e9968a79e3e5fc95c1bbeaa502fd6454ebde5a4bedc"]; // Sha256 hash of new commitment
  const newCommitment = "0x1111111111111111111111111111111111111111111111111111111111111115";
  const res = await axios.post(`${commitMgrServerUrl}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "baseline_verifyAndPush",
    params: [sender, contractAddress, proof, publicInputs, newCommitment],
    id: 1,
  })
  .then((response) => {
    //access the resp here....
    return response.data.result;
  })
  .catch((error) => {
      logger.error(error);
      return false;
  });

  /*if (res) {
    const txHash = res;
    // ITX txs return relayHash, so need to be managed differently
    //if (txManager === 'infura-gas') {
    //  txReceipt = await waitRelayTx(txHash);
    //} else {
      txReceipt = await web3provider.waitForTransaction(txHash);
    //}
    logger.debug(`Status baseline_track: ${res} - ${txReceipt}`);

    return txReceipt;
  } else {
    logger.error(res);
    return false;
  }*/

  return res;

}

export const runTests3 = async (senderAddress, network, saveContract) => {
  
  //################ Deploy Verifier Contract
  let contractInfo;
  const verifierAddress = await axios.post(`${commitMgrServerUrl}/deploy-verifier-contract`, {
      contractName: "Verifier.sol",
      deployedNetwork: network,
      sender: senderAddress
    })
    .then( (response) => {
        //access the resp here....
        logger.debug(`Deploy: ${response.data}`);
        return response.data;
    })
    .then (async (txHash) => {
      logger.debug(`Tx Hash: ${txHash}`);
      return await axios.post(process.env.ETH_CLIENT_HTTP, {
        jsonrpc: "2.0",
        method: "eth_getTransactionReceipt",
        params: [txHash],
        id: 1
      })
      .then( (eth_response) => {
        //access the resp here....
      const result = eth_response.data;
      //Alert('success', 'Settings saved...', 'Settings saved with success into .env file..');
      logger.info(`Verifier Contract Address: ${result.result.contractAddress}`);

      contractInfo = {
          name: 'Verifier.sol', // Contract name
          network: network, // Contract network
          blockNumber: result.result.blockNumber, // Last interation block number
          txHash: txHash, // Tx Hash
          address: result.result.contractAddress, // contract address
          active: true
      }
      saveContract(contractInfo);
      return result.result.contractAddress;
    })
    .catch((error) => {
      logger.error(error);
      //Alert('error', 'ERROR...', "OOPS that didn't work :(");
    });

    })
    .catch((error) => {
        logger.error(error);
        //Alert('error', 'ERROR...', "OOPS that didn't work :(");
    });

  //############# Deploy Shield Contract
  await axios.post(`${commitMgrServerUrl}/deploy-shield-contract`, {
    contractName: "Shield.sol",
    deployedNetwork: network,
    verifierAddress: verifierAddress,
    sender: senderAddress
  })
  .then( (response) => {
      //access the resp here....
      logger.debug(`Deploy: ${response.data}`);
      return response.data;
  })
  .then (async (txHash) => {
    logger.debug(`Tx Hash: ${txHash}`);
    return await axios.post(process.env.ETH_CLIENT_HTTP, {
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      params: [txHash],
      id: 1
    })
    .then( (eth_response) => {
      //access the resp here....
    const result = eth_response.data;
    //Alert('success', 'Settings saved...', 'Settings saved with success into .env file..');
    logger.info(`Shield Contract Address: ${result.result.contractAddress}`);
    contractInfo = {
      name: 'Shield.sol', // Contract name
      network: network, // Contract network
      blockNumber: result.result.blockNumber, // Last interation block number
      txHash: txHash, // Tx Hash
      address: result.result.contractAddress, // contract address
      active: true
    }
    saveContract(contractInfo);

    return result.result;
  })
  .catch((error) => {
    logger.error(error);
    //Alert('error', 'ERROR...', "OOPS that didn't work :(");
  });

  })
  .catch((error) => {
      logger.error(error);
      //Alert('error', 'ERROR...', "OOPS that didn't work :(");
  });

  return true;
}