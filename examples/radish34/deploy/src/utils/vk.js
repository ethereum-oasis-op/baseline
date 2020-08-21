const Paths = require('../paths.json');
const { getVks } = require('../services/zkp');

const Ethers = require('./ethers');
const Wallet = require('./wallet');
const Contract = require('./contract');

const { hexToDec, flattenDeep } = require('./conversions');

// TODO: create config for this structure?
const vkData = {
  createMSA: {
    vk: '',
    txTypeEnumUint: 0, // Each circuit accompanies a function in the Shield contract. The Enum 'TransactionTypes' in the Shield contract is used to refer to each circuit/function. Each Enum option is assigned a number (from 0). We use this number to refer to an Enum option when calling the Shield contract.
  },
  createPO: {
    vk: '',
    txTypeEnumUint: 1,
  },
  createAgreement: {
    vk: '',
    txTypeEnumUint: 2,
  },
};

/**
@param {object} vk
@param {integer} txTypeEnumUint - Each circuit accompanies a function in the Shield contract. The Enum 'TransactionTypes' in the Shield contract is used to refer to each circuit/function. Each Enum option is assigned a number (from 0). We use this number to refer to an Enum option when calling the Shield contract.
@param {string} msgSenderName Name of the person invoking the 'registerVerificationKey' function
*/
const registerVerificationKey = async (circuitName, vkObject, txTypeEnumUint, msgSenderName) => {
  let vk = Object.values(vkObject);
  vk = flattenDeep(vk);
  vk = vk.map(coord => hexToDec(coord));

  const shieldMetadata = Ethers.getContractMetadata(Paths.Shield);

  const contractWithWallet = await Ethers.getContractWithWallet(
    shieldMetadata,
    Contract.getContractAddress('Shield'),
    process.env.RPC_PROVIDER,
    Wallet.getPrivateKey(msgSenderName),
  );

  console.log(`Registering vk ${vk} against txTypeEnumUint ${txTypeEnumUint}`)
  const tx = await contractWithWallet.registerVerificationKey(vk, txTypeEnumUint);
  // The operation is NOT complete yet; we must wait until it is mined
  await tx.wait();

  console.log(`✅  Uploaded verification key for ${circuitName}. TxHash: ${tx.hash}`);
  return tx.hash;
};

const uploadVks = async msgSenderName => {
  const circuitNames = Object.keys(vkData);
  const vks = await getVks(circuitNames);

  circuitNames.forEach((circuitName, index) => {
    vkData[circuitName].vk = vks[index];
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const circuitName of circuitNames) {
    const { vk, txTypeEnumUint } = vkData[circuitName];
    await registerVerificationKey(circuitName, vk, txTypeEnumUint, msgSenderName);
  }
};

module.exports = { uploadVks };
