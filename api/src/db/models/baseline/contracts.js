import mongoose from 'mongoose';
/**
 * Notes: Stores references and meta information for user created contracts
 */

const ContractsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Contracts = mongoose.model('contracts', ContractsSchema);

export const getContractById = async transactionHash => {
  const contract = Contracts.findOne({ _id: transactionHash });
  return contract;
};

export const getContractByName = async name => {
  const contract = Contracts.findOne({ contractName: name });
  return contract;
};

export const getAllContracts = async () => {
  const contracts = await Contracts.find({}).toArray();
  return contracts;
};

export const saveSmartContract = async input => {
  const smartContract = await Contracts.updateOne(
    { _id: input.transactionHash },
    { $set: input },
    { upsert: true },
  );
  return smartContract;
};

export default {
  getContractById,
  getContractByName,
  getAllContracts,
  saveSmartContract,
};
