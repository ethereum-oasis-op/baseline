import { getContractById, getTxReceipt, getAllContracts } from '../services/contract';

export default {
  Query: {
    async contract(parent, args) {
      const { transactionHash } = args;
      const res = await getContractById(transactionHash);
      return res;
    },
    contracts() {
      return getAllContracts();
    },
    async transactionReceipt(parent, args) {
      const { hash } = args;
      const txReceipt = await getTxReceipt(hash);
      const { transactionHash, status, from, to, blockNumber, blockHash, confirmations, gasUsed, cumulativeGasUsed, contractAddress } = txReceipt;
      return {
        transactionHash,
        status,
        from,
        to,
        blockNumber,
        blockHash,
        confirmations,
        gasUsed: gasUsed.toNumber(),
        cumulativeGasUsed: cumulativeGasUsed.toNumber(),
        contractAddress,
      };
    },
  },

  SmartContract: {
    contractName: root => root.contractName,
    contractOwner: root => root.contractOwner,
    contractAddress: root => root.contractAddress,
    transactionHash: root => root.transactionHash,
  },
};
