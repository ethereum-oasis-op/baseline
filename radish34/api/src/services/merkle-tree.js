import request from 'request';
import { poll } from '../utils/poll';
import { concatenateThenHash } from '../utils/crypto/hashes/sha256/sha256';
import { getServerSettings } from '../utils/serverSettings';
import { getContractByName } from './contract';
import { logger } from 'radish34-logger';

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
  logger.info(`Calling /start(${contractName}).`, { service: 'API' });
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
    logger.error(`Polling error, but that might be because the external server missed our call. We will poll again.\n%o`, err, { service: 'ZKP' });
    return false;
  }
};

/**
Starts the merkle-tree microservice's filter
@param {string} contractName
*/
export const startEventFilter = async () => {
  // State the contracts to start filtering. The merkle-tree's config file states which events to filter for each contract.
  logger.info(`Starting the merkle-tree microservice's event filters ...`, { service: 'API' });
  const settings = await getServerSettings();
  const contractNames = ['Shield'];
  await Promise.all(
    contractNames.map(async contractName => {
      try {
        const contractAddress = settings.addresses[contractName];
        logger.info(`contractAddress: ${contractAddress}.`, { service: 'API' });
        const response = await poll(startEventFilterPollingFunction, config.POLLING_FREQUENCY, {
          contractName,
          contractAddress,
        });
        logger.info(`Response from merkle-tree microservice for ${contractName}:\n%o`, response, { service: 'API' });
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
  logger.info(`Calling getLeafByLeafIndex(${contractName}, ${leafIndex}).`, { service: 'API' });
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
  logger.info(`Calling getSiblingPathByLeafIndex(${contractName}, ${leafIndex}).`, { service: 'API' });
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
@param {string} _commitment - the commitment value
@param {integer} commitmentIndex - the leafIndex within the shield contract's merkle tree of the commitment we're getting the sibling path for
@returns {object} containing: an array of strings - where each element of the array is a node of the sister-path of
the path from myToken to the Merkle Root and whether the sister node is to the left or the right (this is needed because the order of hashing matters)
*/
export const getSiblingPath = async (contractName, _commitment, commitmentIndex) => {
  // check the commitment's format:
  // logger.debug(`_commitment: ${_commitment}`, { service: 'API' });
  // if (_commitment.length !== config.LEAF_HASHLENGTH * 2) {
  //   throw new Error(`commitment has incorrect length: ${_commitment}`);
  // }

  // check the database's mongodb aligns with the merkle-tree's mongodb: i.e. check leaf.commitmentIndex === commitment:
  logger.info(`
    Checking leaf:
      contractName: ${contractName}
      commitment: ${_commitment}
      commitmentIndex: ${commitmentIndex}
  `, { service: 'API' });
  const leaf = await getLeafByLeafIndex(contractName, commitmentIndex);
  logger.debug(`Leaf:\n%o.`, leaf, { service: 'API' });
  if (leaf.value !== _commitment)
    throw new Error(
      `FATAL: The given commitmentIndex ${commitmentIndex} returns different commitment values in the database microservice (${_commitment}) vs the merkle-tree microservice (${leaf.value}).`,
    );

  // get the sibling path for the commitment:
  const siblingPath = await getSiblingPathByLeafIndex(contractName, commitmentIndex).then(result =>
    result.map(node => node.value),
  );
  logger.debug('Sibling path:\n%o', siblingPath, { service: 'API' });

  // check the root has been correctly calculated, by cross-referencing with the roots() mapping on-chain:
  const rootInDb = siblingPath[0];
  const contract = await getContractByName(contractName);
  const rootOnChain = await contract.roots(rootInDb);
  logger.debug(`Root in db: ${rootInDb}.`, { service: 'API' });
  logger.debug(`Root on chain: ${rootOnChain}.`, { service: 'API' });
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

  logger.debug(`
    Check root:
      commitment: ${commitment}
      truncatedCommitment: ${truncatedCommitment}
      commitmentIndex: ${commitmentIndex}
      binaryCommitmentIndex: ${binaryCommitmentIndex}
      siblingPath: %o
      root: ${root}
  `, siblingPath, { service: 'API' });

  const siblingPathTruncated = siblingPath.map(node => `0x${node.slice(-NODE_HASHLENGTH * 2)}`);

  let hash216 = truncatedCommitment;
  let hash256;

  for (let r = TREE_HEIGHT; r > 0; r -= 1) {
    const pair = [hash216, siblingPathTruncated[r]];
    logger.debug(`leftInput pre ordering: ${pair[0]}`, { service: 'API' });
    logger.debug(`rightInput pre ordering: ${pair[1]}`, { service: 'API' });
    logger.debug(`left or right?: ${binaryCommitmentIndex[r - 1]}`, { service: 'API' });
    const orderedPair = orderBeforeConcatenation(binaryCommitmentIndex[r - 1], pair);
    logger.debug(`leftInput: ${orderedPair[0]}`, { service: 'API' });
    logger.debug(`rightInput: ${orderedPair[1]}`, { service: 'API' });
    hash256 = concatenateThenHash(...orderedPair);
    logger.debug(`output pre-slice at row ${r - 1}: ${hash256}`, { service: 'API' });
    hash216 = `0x${hash256.slice(-NODE_HASHLENGTH * 2)}`;
    logger.debug(`output at row ${r - 1}: ${hash216}`, { service: 'API' });
  }

  const rootCheck = hash256;

  if (root !== rootCheck) {
    throw new Error(
      `Root ${root} cannot be recalculated from the path and commitment ${commitment}. An attempt to recalculate gives ${rootCheck} as the root.`,
    );
  } else {
    logger.info(`Root ${root} successfully reconciled from first principles using the commitment and its sister-path.`, { service: 'API' });
  }
};
