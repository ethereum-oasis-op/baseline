import { getContractById, getTxReceipt, getAllContracts } from '../../services/contract';

export default {
  Query: {
    contract(parent, args) {
      return getContractById(args.transactionHash).then(res => res);
    },
    contracts() {
      return getAllContracts();
    },
    transactionReceipt(parent, args) {
      return getTxReceipt(args.hash).then(txReceipt => {
        return {
          transactionHash: txReceipt.transactionHash,
          status: txReceipt.status,
          from: txReceipt.from,
          to: txReceipt.to,
          blockNumber: txReceipt.blockNumber,
          blockHash: txReceipt.blockHash,
          confirmations: txReceipt.confirmations,
          gasUsed: txReceipt.gasUsed.toNumber(),
          cumulativeGasUsed: txReceipt.cumulativeGasUsed.toNumber(),
          contractAddress: txReceipt.contractAddress,
        };
      });
    },
  },

  SmartContract: {
    contractName: root => root.contractName,
    contractOwner: root => root.contractOwner,
    contractAddress: root => root.contractAddress,
    transactionHash: root => root.transactionHash,
  },
};
