import dotenv from "dotenv";

dotenv.config();

const nodeHashLength = process.env.HASH_TYPE === 'mimc' ? 32 : 27;
const zeroHex =
  process.env.HASH_TYPE === 'mimc'
    ? '0x0000000000000000000000000000000000000000000000000000000000000000'
    : '0x000000000000000000000000000000000000000000000000000000';

const config = {
  // general:
  // ZERO: '0x0000000000000000000000000000000000000000000000000000000000000000', // 32-byte hex string representing zero, for hashing with '0' up the tree.
  ZERO: zeroHex, // 27-byte hex string representing zero, for hashing with '0' up the tree. Byte length must match that of NODE_HASHLENGTH

  // Tree parameters. You also need to set these in the MerkleTree.sol contract.
  HASH_TYPE: process.env.HASH_TYPE,
  LEAF_HASHLENGTH: 32, // expected length of leaves' values in bytes
  NODE_HASHLENGTH: nodeHashLength, // expected length of nodes' values up the merkle tree, in bytes
  BUCKET_SIZE: 25000, // how many nodes to store in single mongo document
  ZOKRATES_PRIME: '21888242871839275222246405745257275088548364400416034343698204186575808495617', // decimal representation of the prime p of GaloisField(p)

  POLLING_FREQUENCY: 6000, // milliseconds
  FILTER_GENESIS_BLOCK_NUMBER: 0, // blockNumber

  tolerances: {
    LAG_BEHIND_CURRENT_BLOCK: 5, // add warnings for use of tree data which lags further behind the current block (e.g. due to anonymity concerns)
  },

  UPDATE_FREQUENCY: 100, // TODO: recalculate the tree every 'x' leaves - NOT USED YET
  BULK_WRITE_BUFFER_SIZE: 1000, // number of documents to add to a buffer before bulk-writing them to the db
};

export {
  config
}
