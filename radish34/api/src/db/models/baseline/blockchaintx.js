import mongoose from 'mongoose';

/**
 * Notes:
 *  This collection is very thin at the moment.
 */

// TODO: What fields are appropriate to store? Do we want to store anything at all? or just the txHashes that correspond to jobIds?
// TODO: Or should we just store txHashes in the result of a job itself? collection.baselineTask.jobs[0]
const BlockchainTxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const BlockchainTx = mongoose.model('blockchaintx', BlockchainTxSchema);

export const saveBlockchainTx = async input => {
  const blockchainTx = await BlockchainTx.updateOne(
    { _id: input.transactionHash },
    { $set: input },
    { upsert: true },
  );
  return blockchainTx;
};

export default {
  saveBlockchainTx,
};
