import { logger } from "../logger";
import { merkleTrees } from "../db/models/MerkleTree";
import { leafIndexToNodeIndex, calculateBucket } from "./utils";

/**
 * Insert a new leaf into the merkle tree
 * @param {string} contractAddress - address of merkle-tree contract
 * @param {object} leaf
 */
async function insertLeaf(contractAddress, leaf) {
  logger.info(`Inserting new leaf for merkle id ${contractAddress}: %o`, leaf);
  // Find tree height
  const merkleTree_0 = await merkleTrees.findOne({ _id: `${contractAddress}_0` });
  const treeHeight = merkleTree_0.treeHeight;

  // Calculate bucket for leaf location
  const nodeIndex = leafIndexToNodeIndex(treeHeight, leaf.leafIndex);
  const bucketIndex = await calculateBucket(nodeIndex);
  logger.debug(`Calculated bucket index: ${bucketIndex}`);
  const merkleSegment = await merkleTrees.findOne({ _id: `${contractAddress}_${bucketIndex}` });

  const nodes = merkleSegment.nodes;
  nodes[nodeIndex] = leaf;
  const latestLeaf = {
    blockNumber: leaf.blockNumber,
    leafIndex: leaf.leafIndex
  };

  await merkleTrees.updateOne(
    { _id: `${contractAddress}_${bucketIndex}` },
    { nodes }
  );

  const updatedTree = await merkleTrees.updateOne(
    { _id: `${contractAddress}_0` },
    { latestLeaf }
  );

  return updatedTree;
}

/**
 * Get a single leaf by its leafIndex
 * @param {number} leafIndex
 * @returns {object} the leaf object
 */
async function getLeafByLeafIndex(contractAddress, leafIndex) {
  logger.info(`Get leaf index ${leafIndex} for merkle id ${contractAddress}`);
  // Find tree height
  const merkleTree_0 = await merkleTrees.findOne({ _id: `${contractAddress}_0` });
  const treeHeight = merkleTree_0.treeHeight;

  // Calculate bucket for leaf location
  const nodeIndex = leafIndexToNodeIndex(treeHeight, leafIndex);
  const bucketIndex = await calculateBucket(nodeIndex);
  const merkleSegment = await merkleTrees.findOne({ _id: `${contractAddress}_${bucketIndex}` });

  const result = merkleSegment.nodes.filter(node => {
    return node && node.leafIndex === leafIndex;
  });

  if (result[0]) return result[0];
  return {};
}

/**
 * Get all leaves within a range determined by their leafIndices
 * @param {string} contractAddress - address of merkle-tree contract
 * @param {number} minIndex
 * @param {number} maxIndex
 * @returns {array} an array of leaf objects
 */
async function getLeavesByLeafIndexRange(contractAddress, minIndex, maxIndex) {
  logger.info(`Getting leaves for merkle id ${contractAddress} in index range: ${minIndex} - ${maxIndex}`);
  // Find tree height
  const merkle_0 = await merkleTrees.findOne({ _id: `${contractAddress}_0` });
  const treeHeight = merkle_0.treeHeight;
  let leaves = [];

  for (let leafIndex = minIndex; leafIndex <= maxIndex; leafIndex++) {
    // Calculate bucket for leaf location
    const nodeIndex = leafIndexToNodeIndex(treeHeight, leafIndex);
    const bucketIndex = await calculateBucket(nodeIndex);
    const merkleSegment = await merkleTrees.findOne({ _id: `${contractAddress}_${bucketIndex}` });
    const result = merkleSegment.nodes.filter(node => {
      return node && (node.leafIndex >= leafIndex) && (node.leafIndex <= maxIndex);
    });
    leaves = leaves.concat(result);
    const incr = result.length ? result.length - 1 : 0;
    leafIndex += incr;
  }

  return leaves;
}

export {
  insertLeaf,
  getLeafByLeafIndex,
  getLeavesByLeafIndexRange,
};
