import { getContractById, getAllContracts } from '../../db/models/baseline/contracts';
import { getTxReceipt } from '../../db/models/baseline/blockchaintx';

export default {
  Query: {
    contract(parent, args) {
      return getContractById(args.transactionHash).then(res => res);
    },
    contracts() {
      return getAllContracts();
    },
    transactionReceipt(parent, args) {
      // TODO: Reconnect this
      // return getTxReceipt(args.hash).then(res => res);
    },
  },

  SmartContract: {
    contractName: root => root.contractName,
    contractOwner: root => root.contractOwner,
    contractAddress: root => root.contractAddress,
    transactionHash: root => root.transactionHash,
  },
};
