import { config } from "./config";
import { getLeavesByLeafIndexRange } from "./leaves";
import { merkleTrees } from "../db/models/MerkleTree";
import { logger } from "../logger";
import * as utils from "./utils";

/**
 * Calculate the path (each parent up the tree) from a given leaf to the root.
 * @param {string} merkleId - a MerkleTree.sol contract address
 * @param {integer} leafIndex - the index of the leaf for which we are computing the path
 */
async function getPathByLeafIndex(merkleId, leafIndex) {
  logger.info(`getPathByLeafIndex(${merkleId}, ${leafIndex})`);
  await updateTree(merkleId);
  const merkleTree = await merkleTrees.findOne({ _id: `${merkleId}_0` });
  const treeHeight = merkleTree.treeHeight;

  // construct an array of indices to query from the db:
  const singleNodeIndex = utils.leafIndexToNodeIndex(treeHeight, leafIndex);
  const pathIndices = utils.getPathIndices(singleNodeIndex);
  let pathNodes = [];
  let prevBucket = 0;
  let merkleSegment = merkleTree;

  // Check whether some nodeIndices don't yet exist in the db. 
  // If they don't, we'll presume their values are zero, and add these to the 'nodes' before returning them.
  for (let count = 0; count < pathIndices.length; count++) {
    const nodeIndex = pathIndices[count];
    const bucketIndex = await utils.calculateBucket(nodeIndex);
    // Fetch new bucket if calculated index differs from prevBucket
    if (bucketIndex !== prevBucket) {
      merkleSegment = await merkleTrees.findOne({ _id: `${merkleId}_${bucketIndex}` });
      prevBucket = bucketIndex;
    }
    const nodes = merkleSegment.nodes;
    const localIndex = nodeIndex % config.BUCKET_SIZE;
    let node = {
      nodeIndex,
      hash: config.ZERO
    }
    if (nodes[localIndex]) {
      node.hash = nodes[localIndex].hash
    }
    // insert the node into the nodes array:
    pathNodes.push(node);
  }
  return pathNodes;
}

/**
 * Calculate the siblingPath or 'witness path' for a given leaf.
 * @param {string} merkleId - a MerkleTree.sol contract address
 * @param {integer} leafIndex - the index of the leaf for which we are computing the siblingPath
 */
async function getSiblingPathByLeafIndex(merkleId, leafIndex) {
  logger.info(`getSiblingPathByLeafIndex(${merkleId}, ${leafIndex})`);
  const merkleTree = await merkleTrees.findOne({ _id: `${merkleId}_0` });
  const treeHeight = merkleTree.treeHeight;

  // construct an array of indices to query from the db:
  const singleNodeIndex = utils.leafIndexToNodeIndex(treeHeight, leafIndex);
  const siblingPathIndices = utils.getSiblingPathIndices(singleNodeIndex);
  const siblingNodes = [];
  let prevBucket = 0;
  let merkleSegment = merkleTree;

  for (let count = 0; count < siblingPathIndices.length; count++) {
    const nodeIndex = siblingPathIndices[count];
    const bucketIndex = await utils.calculateBucket(nodeIndex);
    // Fetch new bucket if calculated index differs from prevBucket
    if (bucketIndex !== prevBucket) {
      merkleSegment = await merkleTrees.findOne({ _id: `${merkleId}_${bucketIndex}` });
      prevBucket = bucketIndex;
    }
    const nodes = merkleSegment.nodes;
    const localIndex = nodeIndex % config.BUCKET_SIZE;
    let node = {
      nodeIndex,
      hash: config.ZERO
    }
    // Check whether some nodeIndices don't yet exist in the db. 
    // If they don't, we'll presume their values are zero, and add these to the 'nodes' before returning them.
    if (nodes[localIndex]) {
      node.hash = nodes[localIndex].hash
    }
    // insert the node into the nodes array:
    siblingNodes.push(node);
  }
  return siblingNodes;
}

/**
 * Updates the entire tree based on the latest-stored leaves.
 * @param {string} merkleId - a MerkleTree.sol contract address
 * @param {string} root - root hash of the merkle tree
 */
async function updateTree(merkleId) {
  logger.info(`Updating merkle tree: ${merkleId}`);

  const merkleTree_0 = await merkleTrees.findOne({ _id: `${merkleId}_0` })
  const { treeHeight, latestLeaf } = merkleTree_0;

  if (!latestLeaf.blockNumber) {
    logger.info('There are no (reliable) leaves in the tree. Nothing to update.');
    return "0x0000000000000000000000000000000000000000000000000000000000000000";
  }

  // get the latest recalculation (to know how up-to-date the nodes of our tree actually are):
  let latestRecalculation = merkleTree_0.latestRecalculation || {};
  const latestRecalculationLeafIndex =
    (latestRecalculation.leafIndex === undefined) ? -1 : latestRecalculation.leafIndex;

  const fromLeafIndex = latestRecalculationLeafIndex + 1;
  const toLeafIndex = latestLeaf && latestLeaf.leafIndex ? latestLeaf.leafIndex : 0;

  logger.debug(`latestRecalculationLeafIndex: ${latestRecalculationLeafIndex}`);
  logger.debug(`toLeafIndex: ${toLeafIndex}`);
  // Check whether we're already up-to-date
  if (latestRecalculationLeafIndex < toLeafIndex) {
    // We're not up-to-date. Recalculate any nodes along the path from the new leaves to the root
    logger.debug(`Updating the tree from leaf ${fromLeafIndex} to leaf ${toLeafIndex}`);

    const numberOfHashes = utils.getNumberOfHashes(toLeafIndex, fromLeafIndex, treeHeight);
    logger.debug(`${numberOfHashes} hashes are required to update the tree...`);

    let { frontier } = latestRecalculation;
    frontier = frontier === undefined ? [] : frontier;
    const leaves = await getLeavesByLeafIndexRange(merkleId, fromLeafIndex, toLeafIndex);
    const leafValues = leaves.map(leaf => leaf.hash);

    logger.debug(`found leaves: %o`, leaves);
    logger.debug(`leafValues: %o`, leafValues);
    logger.debug(`current leaf count: ${fromLeafIndex}`);
    const root = await utils.updateNodes(merkleId, frontier, leafValues, fromLeafIndex);
    return root;
  }
  logger.info(`The tree is already up to date. Root is ${latestRecalculation.root}`);
  return latestRecalculation.root;
}

export {
  getPathByLeafIndex,
  getSiblingPathByLeafIndex,
  updateTree
};
