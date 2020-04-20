import request from 'request';
import { poll } from '../utils/poll';
import { concatenateThenHash } from '../utils/crypto/hashes/sha256/sha256';
import { getServerSettings } from '../utils/serverSettings';
import { getContractByName } from './contract';

const config = {
  // Tree parameters. You also need to set these in the MerkleTree.sol contract.
  LEAF_HASHLENGTH: 32, // expected length of leaves' values in bytes
  NODE_HASHLENGTH: 27, // expected length of nodes' values up the merkle tree, in bytes
  TREE_HEIGHT: 4, // the hieght of the Merkle tree
  POLLING_FREQUENCY: 6000, // milliseconds
};

const url = process.env.MERKLE_TREE_URL;

/**
Start the event filter in the merkle-tree microservice, for the given contract
*/
async function start(contractName, contractAddress) {
  console.log(`\nCalling /start(${contractName})`);
  return new Promise((resolve, reject) => {
    const options = {
      url: `${url}/start`,
      method: 'POST',
      json: true,
      headers: { contractname: contractName },
      body: { contractAddress },
    };
    request(options, (err, res, body) => {
      if (err) reject(err);
      else resolve(body.data);
    });
  });
}

/**
Posts a starts merkle-tree microservice's filter
@returns {false | object} Polling functions MUST return FALSE if the poll is unsuccessful. Otherwise we return the response from the merkle-tree microservice
*/
const startEventFilterPollingFunction = async args => {
  try {
    const { contractName, contractAddress } = args;

    const response = await start(contractName, contractAddress);

    return response;
  } catch (err) {
    console.log(
      `Got a polling error "${err}", but that might be because the external server missed our call - we'll poll again...`,
    );
    return false;
  }
};

/**
Starts the merkle-tree microservice's filter
@param {string} contractName
*/
export const startEventFilter = async () => {
  // State the contracts to start filtering. The merkle-tree's config file states which events to filter for each contract.
  console.log(`\nStarting the merkle-tree microservice's event filters...`);
  const settings = await getServerSettings();
  const contractNames = ['Shield'];
  await Promise.all(
    contractNames.map(async contractName => {
      try {
        const contractAddress = settings.addresses[contractName];
        console.log('contractAddress:', contractAddress)
        const response = await poll(startEventFilterPollingFunction, config.POLLING_FREQUENCY, {
          contractName,
          contractAddress,
        });
        console.log(`\nResponse from merkle-tree microservice for ${contractName}:`);
        console.log(response);
        return response;
      } catch (err) {
        throw new Error(`Could not start merkle-tree microservice's filter for ${contractName}`);
      }
    }),
  );
};

/**
Get the leaf object for the given leafIndex.
@param {string} contractName
@param {integer} leafIndex
*/
async function getLeafByLeafIndex(contractName, leafIndex) {
  console.log(`\nCalling getLeafByLeafIndex(${contractName}, ${leafIndex})`);
  return new Promise((resolve, reject) => {
    const options = {
      url: `${url}/leaf/index/${leafIndex}`,
      method: 'GET',
      json: true,
      headers: { contractname: contractName },
      // body:, // no body; uses url param
    };
    request(options, (err, res, body) => {
      if (err) reject(err);
      else resolve(body.data);
    });
  });
}

/**
Get the nodes on the sibling path from the given leafIndex to the root.
@param {string} contractName
@param {integer} leafIndex
*/
async function getSiblingPathByLeafIndex(contractName, leafIndex) {
  console.log(`\nCalling getSiblingPathByLeafIndex(${contractName}, ${leafIndex})`);
  return new Promise((resolve, reject) => {
    const options = {
      url: `${url}/siblingPath/${leafIndex}`,
      method: 'GET',
      json: true,
      headers: { contractname: contractName },
      // body:, // no body; uses url param
    };
    request(options, (err, res, body) => {
      if (err) reject(err);
      else resolve(body.data);
    });
  });
}

/**
This function computes the path through a Mekle tree to get from a token
to the root by successive hashing.  This is needed for part of the private input
to proofs that need demonstrate that a token is in a Merkle tree.
It works for any size of Merkle tree, it just needs to know the tree depth, which it gets from config.js
@param {string} contractName - the name of the contract being filtered by the merkle-tree service (most likely 'Shield')
@param {string} commitment - the commitment value
@param {integer} commitmentIndex - the leafIndex within the shield contract's merkle tree of the commitment we're getting the sibling path for
@returns {object} containing: an array of strings - where each element of the array is a node of the sister-path of
the path from myToken to the Merkle Root and whether the sister node is to the left or the right (this is needed because the order of hashing matters)
*/
export const getSiblingPath = async (contractName, _commitment, commitmentIndex) => {
  // check the commitment's format:
  // console.log('commitment', commitment);
  // if (commitment.length !== config.LEAF_HASHLENGTH * 2) {
  //   throw new Error(`commitment has incorrect length: ${commitment}`);
  // }

  // check the database's mongodb aligns with the merkle-tree's mongodb: i.e. check leaf.commitmentIndex === commitment:
  console.log('\nChecking leaf...');
  console.log('contractName:', contractName);
  console.log('commitment:', _commitment);
  console.log('commitmentIndex:', commitmentIndex);
  const leaf = await getLeafByLeafIndex(contractName, commitmentIndex);
  // console.log('leaf:', leaf);
  if (leaf.value !== _commitment)
    throw new Error(
      `FATAL: The given commitmentIndex ${commitmentIndex} returns different commitment values in the database microservice (${_commitment}) vs the merkle-tree microservice (${leaf.value}).`,
    );

  // get the sibling path for the commitment:
  const siblingPath = await getSiblingPathByLeafIndex(contractName, commitmentIndex).then(result =>
    result.map(node => node.value),
  );

  // console.log(siblingPath);

  // check the root has been correctly calculated, by cross-referencing with the roots() mapping on-chain:
  // console.log('\nChecking root...');
  const rootInDb = siblingPath[0];
  // console.log('rootInDb:', rootInDb);
  const contract = await getContractByName(contractName);
  const rootOnChain = await contract.roots(rootInDb);
  // console.log('rootOnChain:', rootOnChain);
  if (rootOnChain !== rootInDb)
    throw new Error(
      'FATAL: The root calculated within the merkle-tree microservice does not match any historic on-chain roots.',
    );

  return siblingPath;
};

/**
Paired with checkRoot() - for DEBUGGING only
*/
const orderBeforeConcatenation = (order, pair) => {
  if (parseInt(order, 10) === 0) {
    return pair;
  }
  return pair.reverse();
};

/**
checkRoot - for DEBUGGING only. Helps give detailed logging for each hash up the merkle-tree, so as to better debug zokrates code.
*/
export const checkRoot = (commitment, commitmentIndex, siblingPath, root) => {
  // define Merkle Constants:
  const { TREE_HEIGHT, NODE_HASHLENGTH } = config;

  const truncatedCommitment = commitment.slice(-NODE_HASHLENGTH * 2); // truncate to the desired 216 bits for Merkle Path computations

  const binaryCommitmentIndex = commitmentIndex
    .toString(2) // to binary
    .padStart(TREE_HEIGHT, '0') // pad to correct length
    .split(''); // convert to array for easier iterability

  // console.log(`commitment:`, commitment);
  // console.log(`truncatedCommitment:`, truncatedCommitment);
  // console.log(`commitmentIndex:`, commitmentIndex);
  // console.log(`binaryCommitmentIndex:`, binaryCommitmentIndex);
  // console.log(`siblingPath:`, siblingPath);
  // console.log(`root:`, root);

  const siblingPathTruncated = siblingPath.map(node => `0x${node.slice(-NODE_HASHLENGTH * 2)}`);

  let hash216 = truncatedCommitment;
  let hash256;

  for (let r = TREE_HEIGHT; r > 0; r -= 1) {
    const pair = [hash216, siblingPathTruncated[r]];
    // console.log('leftInput pre ordering:', pair[0]);
    // console.log('rightInput pre ordering:', pair[1]);
    // console.log('left or right?:', binaryCommitmentIndex[r - 1]);
    const orderedPair = orderBeforeConcatenation(binaryCommitmentIndex[r - 1], pair);
    // console.log('leftInput:', orderedPair[0]);
    // console.log('rightInput:', orderedPair[1]);
    hash256 = concatenateThenHash(...orderedPair);
    // keep the below comments for future debugging:
    // console.log(`output pre-slice at row ${r - 1}:`, hash256);
    hash216 = `0x${hash256.slice(-NODE_HASHLENGTH * 2)}`;
    // console.log(`output at row ${r - 1}:`, hash216);
  }

  const rootCheck = hash256;

  if (root !== rootCheck) {
    throw new Error(
      `Root ${root} cannot be recalculated from the path and commitment ${commitment}. An attempt to recalculate gives ${rootCheck} as the root.`,
    );
  } else {
    console.log(
      `\nRoot ${root} successfully reconciled from first principles using the commitment and its sister-path.`,
    );
  }
};
