import { getContractById, getTxReceipt, getAllContracts } from '../services/contract';

export default {
  Query: {
    contract(parent, args) {
      return getContractById(args.transactionHash).then(res => res);
    },
    contracts() {
      return getAllContracts();
    },
    transactionReceipt(parent, args) {
      return getTxReceipt(args.hash).then(res => res);
    },
  },

  SmartContract: {
    contractName: root => root.contractName,
    contractOwner: root => root.contractOwner,
    contractAddress: root => root.contractAddress,
    transactionHash: root => root.transactionHash,
  },
};
