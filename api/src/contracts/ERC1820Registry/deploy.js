import {
  getServerSettings,
  setAddressServerSetting,
} from '../../db/models/baseline/server/settings';
import { getContractById, saveSmartContract } from '../../db/models/baseline/contracts';
import { saveBlockchainTx } from '../../db/models/baseline/blockchaintx';
import { getProvider, deployContract, getPrivateKey, getWallet } from '../../utils/ethers';

export default async contractName => {
  const config = await getServerSettings();
  const uri = config.blockchainProvider; // TODO: Should be getting this from /rpc/index.js
  const privateKey = await getPrivateKey();
  const wallet = await getWallet(uri, privateKey);
  // TODO: Should get it like how all other contracts get it. abi
  const returnData = await deployContract(getERC1820RegistryJson(), uri, privateKey, null);
  const blockchainTransactionRecord = {
    transactionHash: returnData.hash,
    status: 'pending',
  };
  await saveBlockchainTx(blockchainTransactionRecord);
  const inputWithContractAddress = {
    contractName: contractName,
    contractOwner: wallet.signingKey.address,
    contractAddress: returnData.address,
    transactionHash: returnData.hash,
  };
  await saveSmartContract(inputWithContractAddress);
  await setAddressServerSetting('ERC1820Registry', returnData.address);
  const provider = getProvider(uri);
  let receiptSatus;
  provider.waitForTransaction(returnData.hash).then(receipt => {
    if (receipt.status === 1) {
      receiptSatus = 'success';
    } else {
      receiptSatus = 'failure';
    }
    const successRecord = {
      transactionHash: receipt.transactionHash,
      status: receiptSatus,
    };
    saveBlockchainTx(successRecord);
  });
  const contract = await getContractById(returnData.hash);
  return { contract };
};
