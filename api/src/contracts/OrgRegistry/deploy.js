import {
  getServerSettings,
  setServerSetting,
  setAddressServerSetting,
} from '../../db/models/baseline/server/settings';
import { getContractById, saveSmartContract } from '../../db/models/baseline/contracts';
import { saveBlockchainTx } from '../../db/models/baseline/blockchaintx';
import { getProvider, deployContract, getPrivateKey, getWallet } from '../../utils/ethers';

// TODO: Why aren't we saving this contract like ERC1820
export default async addressOfRegistrar => {
  const config = await getServerSettings();
  const uri = config.blockchainProvider;
  const privateKey = await getPrivateKey();
  const wallet = await getWallet(uri, privateKey);
  const returnData = await deployContract(
    getOrgRegistryJson(), // TODO: Would be nice if this was handled another way
    uri,
    privateKey,
    addressOfRegistrar,
  );
  const pendingRecord = {
    transactionHash: returnData.hash,
    status: 'pending',
  };
  await saveBlockchainTx(pendingRecord);
  const inputWithContractAddress = {
    contractName: 'Organization Registry Smart Contract',
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
