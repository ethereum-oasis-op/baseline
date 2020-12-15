// Set of utilities for merkle-tree calculations
// bit operations are essential for merkle-tree computations.

/* tslint:disable no-bitwise */

import dotenv from "dotenv";
import { config } from "./config";
import { logger } from "../logger";
import { concatenateThenHash } from "./hash";
import { merkleTrees } from "../db/models/MerkleTree";

dotenv.config();

function rightShift(integer, shift) {
  return Math.floor(integer / 2 ** shift);
}

// INDEX CONVERSIONS

async function calculateBucket(nodeIndex) {
  const bucketIndex = Math.floor(nodeIndex / config.BUCKET_SIZE);
  return bucketIndex;
}

function leafIndexToNodeIndex(treeHeight, leaf_index) {
  const treeWidth = 2 ** treeHeight;
  const leafIndex = Number(leaf_index);
  const nodeIndex = leafIndex + treeWidth - 1;
  logger.debug(`leafIndex ${leafIndex} converted to nodeIndex ${nodeIndex}`);
  return nodeIndex;
}

// 'DECIMAL' NODE INDICES

function siblingNodeIndex(node_index) {
  const nodeIndex = Number(node_index);
  // odd? then the node is a left-node, so sibling is to the right.
  // even? then the node is a right-node, so sibling is to the left.
  const siblingIndex = nodeIndex % 2 === 1 ? nodeIndex + 1 : nodeIndex - 1;
  // If siblingIndex is negative, just return 0
  return siblingIndex < 0 ? 0 : siblingIndex;
}

function parentNodeIndex(node_index) {
  const nodeIndex = Number(node_index);
  return nodeIndex % 2 === 1 ? rightShift(nodeIndex, 1) : rightShift(nodeIndex - 1, 1);
}

// COMPLEX TREE FUNCTIONS

// Calculate the indices of the path from a particular leaf up to the root.
// @param {integer} nodeIndex - the nodeIndex of the leaf for which we wish to calculate the PathIndices. Not to be confused with leafIndex.
function getPathIndices(node_index) {
  let nodeIndex = Number(node_index);
  let indices = [];

  while (nodeIndex > 0) {
    const parentIndex = parentNodeIndex(nodeIndex);
    indices.push(parentIndex);
    nodeIndex = parentIndex;
  }

  return indices;
}

// Calculate the indices of the sibling path of a particular leaf up to the root.
// @param {integer} nodeIndex - the nodeIndex of the leaf for which we wish to calculate the siblingPathIndices. Not to be confused with leafIndex.
function getSiblingPathIndices(node_index) {
  const nodeIndex = Number(node_index);
  const indices = getPathIndices(nodeIndex);
  const firstSibling = siblingNodeIndex(nodeIndex);
  let siblingIndices = [firstSibling];
  for (let index = 0; index < indices.length; index++) {
    const siblingIndex = siblingNodeIndex(indices[index]);
    siblingIndices.push(siblingIndex);
  }
  logger.info(`Found sibling indices: %o`, siblingIndices)
  return siblingIndices;
}

// Javascript implementation of the corresponding Solidity function in MerkleTree.sol
function getFrontierSlot(leafIndex) {
  let slot = 0;
  if (leafIndex % 2 === 1) {
    let exp1 = 1;
    let pow1 = 2;
    let pow2 = pow1 << 1;
    while (slot === 0) {
      if ((leafIndex + 1 - pow1) % pow2 === 0) {
        slot = exp1;
      } else {
        pow1 = pow2;
        pow2 <<= 1;
        exp1 += 1;
      }
    }
  }
  return slot;
}

// Javascript implementation of the corresponding Solidity function in MerkleTree.sol
async function updateNodes(merkleId, frontier, leafValues, currentLeafCount) {
  logger.info(`Updating nodes`);
  const merkleTree_0 = await merkleTrees.findOne({ _id: `${merkleId}_0` })
  const latestLeaf = merkleTree_0.latestLeaf;
  const treeHeight = merkleTree_0.treeHeight;

  const newFrontier = frontier;

  if (frontier.length !== treeHeight + 1 && treeHeight !== 32) {
    newFrontier.length = treeHeight + 1;
  }

  // check that space exists in the tree:
  const treeWidth = 2 ** treeHeight;
  const numberOfLeavesAvailable = treeWidth - currentLeafCount;
  const numberOfLeaves = Math.min(leafValues.length, numberOfLeavesAvailable);

  let slot;
  // the node value before truncation (truncation is sometimes done so that the nodeValue (when concatenated with another)
  // fits into a single hashing round in the next hashing iteration up the tree).
  let nodeValueFull;
  // the truncated nodeValue
  let nodeValue;
  let nodeIndex;

  // consider each new leaf in turn, from left to right:
  for (
    let leafIndex = currentLeafCount;
    leafIndex < currentLeafCount + numberOfLeaves;
    leafIndex++
  ) {

    nodeValueFull = leafValues[leafIndex - currentLeafCount];
    nodeValue = `0x${nodeValueFull.slice(-config.NODE_HASHLENGTH * 2)}`; // truncate hashed value, so it 'fits' into the next hash.
    nodeIndex = leafIndexToNodeIndex(treeHeight, leafIndex);

    slot = getFrontierSlot(leafIndex); // determine at which level we will next need to store a nodeValue

    if (slot === 0) {
      newFrontier[slot] = nodeValue; // store in frontier
      continue; // eslint-disable-line no-continue
    }

    // hash up to the level whose nodeValue we'll store in the frontier slot:
    for (let level = 1; level <= slot; level++) {
      if (nodeIndex % 2 === 0) {
        // even nodeIndex
        nodeValueFull = concatenateThenHash(frontier[level - 1], nodeValue); // the parentValue, but will become the nodeValue of the next level
        nodeValue = `0x${nodeValueFull.slice(-config.NODE_HASHLENGTH * 2)}`; // truncate hashed value, so it 'fits' into the next hash.
      } else {
        // odd nodeIndex
        nodeValueFull = concatenateThenHash(nodeValue, config.ZERO); // the parentValue, but will become the nodeValue of the next level
        nodeValue = `0x${nodeValueFull.slice(-config.NODE_HASHLENGTH * 2)}`; // truncate hashed value, so it 'fits' into the next hash.
      }
      nodeIndex = parentNodeIndex(nodeIndex); // move one row up the tree
      // Calculate bucket for leaf location
      const bucketIndex = await calculateBucket(nodeIndex);
      const merkleSegment = await merkleTrees.findOne({ _id: `${merkleId}_${bucketIndex}` });
      const newNodes = merkleSegment.nodes;

      // update the newNodes array
      const node = {
        hash: nodeValue,
        nodeIndex,
      };
      logger.debug(`Updated node: %o`, node);
      newNodes[nodeIndex % config.BUCKET_SIZE] = node;
      await merkleTrees.updateOne(
        { _id: `${merkleId}_${bucketIndex}` },
        { nodes: newNodes }
      );
    }
    newFrontier[slot] = nodeValue; // store in frontier
  }

  // So far we've added all leaves, and hashed up to a particular level of the tree. We now need to continue hashing from that level until the root:
  for (let level = slot + 1; level <= treeHeight; level++) {
    if (nodeIndex % 2 === 0) {
      // even nodeIndex
      nodeValueFull = concatenateThenHash(frontier[level - 1], nodeValue); // the parentValue, but will become the nodeValue of the next level
      nodeValue = `0x${nodeValueFull.slice(-config.NODE_HASHLENGTH * 2)}`; // truncate hashed value, so it 'fits' into the next hash.
    } else {
      // odd nodeIndex
      nodeValueFull = concatenateThenHash(nodeValue, config.ZERO); // the parentValue, but will become the nodeValue of the next level
      nodeValue = `0x${nodeValueFull.slice(-config.NODE_HASHLENGTH * 2)}`; // truncate hashed value, so it 'fits' into the next hash.
    }
    nodeIndex = parentNodeIndex(nodeIndex); // move one row up the tree
    // Calculate bucket for leaf location
    const bucketIndex = await calculateBucket(nodeIndex);
    const merkleSegment = await merkleTrees.findOne({ _id: `${merkleId}_${bucketIndex}` });
    const newNodes = merkleSegment.nodes;

    // update the newNodes array
    const node = {
      hash: nodeIndex === 0 ? nodeValueFull : nodeValue, // we can add the full 32-byte root (nodeIndex=0) to the db, because it doesn't need to fit into another hash round.
      nodeIndex,
    };
    logger.debug(`Updated node: %o`, node);
    newNodes[nodeIndex % config.BUCKET_SIZE] = node;
    await merkleTrees.updateOne(
      { _id: `${merkleId}_${bucketIndex}` },
      { nodes: newNodes }
    );
  }

  const root = nodeValueFull;
  const latestRecalculation = {
    blockNumber: latestLeaf.blockNumber,
    leafIndex: latestLeaf.leafIndex,
    root,
    frontier: newFrontier,
  };

  await merkleTrees.updateOne(
    { _id: `${merkleId}_0` },
    { latestRecalculation }
  );
  logger.info(`Off-chain tree updated with new root: ${root}`);

  return root;
};

/**
 * Calculates the exact number of hashes required to add a consecutive batch of leaves to a tree
 * @param {integer} maxLeafIndex - the highest leafIndex of the batch
 * @param {integer} minLeafIndex - the lowest leafIndex of the batch
 * @param {integer} height - the height of the merkle tree
 */
function getNumberOfHashes(maxLeafIndex, minLeafIndex, height) {
  let hashCount = 0;
  let increment;
  let hi = Number(maxLeafIndex);
  let lo = Number(minLeafIndex);
  const batchSize = hi - lo + 1;
  const binHi = hi.toString(2); // converts to binary
  const bitLength = binHi.length;

  for (let level = 0; level < bitLength; level += 1) {
    increment = hi - lo;
    hashCount += increment;
    hi = rightShift(hi, 1);
    lo = rightShift(lo, 1);
  }
  return hashCount + height - (batchSize - 1);
}

// Functions used by controller.js
export {
  leafIndexToNodeIndex,
  calculateBucket,
  getPathIndices,
  getSiblingPathIndices,
  updateNodes,
  getNumberOfHashes,
};
