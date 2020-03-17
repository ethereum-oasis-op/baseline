export default async addressOfERC1820 => {
  const config = await getServerSettings();
  const uri = config.blockchainProvider;
  const privateKey = await getPrivateKey();
  const wallet = await getWallet(uri, privateKey);
  const returnData = await deployContract(getRegistarJson(), uri, privateKey, addressOfERC1820);
  const pendingRecord = {
    transactionHash: returnData.hash,
    status: 'pending',
  };
  await saveBlockchainTransaction(pendingRecord);
  const inputWithContractAddress = {
    contractName: 'Registrar',
    contractOwner: wallet.signingKey.address,
    contractAddress: returnData.address,
    transactionHash: returnData.hash,
  };
  await saveSmartContract(inputWithContractAddress);
  await setRegistrarAddress(returnData.address);
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
    saveBlockchainTransaction(successRecord);
  });
  const contract = await getContractById(returnData.hash);
  return { contract };
};
