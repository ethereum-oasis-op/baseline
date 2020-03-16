const fs = require('fs');
const { ethers, utils } = require('ethers');
const { BigNumber } = require('ethers/utils');

let instance = null;
let networkId = null;

const getProvider = uri => {
  if (instance) return instance;
  instance = new ethers.providers.JsonRpcProvider(uri);
  return instance;
};

const getDefaultProvider = async uri => {
  if (networkId === uri && instance) {
    return instance;
  }
  networkId = uri;
  instance = ethers.getDefaultProvider(uri);
  return instance;
};

const getWallet = (uri, privateKey) => {
  if (!privateKey) throw new ReferenceError('No key provided for getWallet');
  const provider = getProvider(uri);
  return new ethers.Wallet(privateKey, provider);
};

const getSigner = address => {
  if (!address) throw new ReferenceError('No address provided for getSigner');
  const provider = getProvider();
  return provider.getSigner(address);
};

const sendSignedTransaction = async signedTransaction => {
  const provider = getProvider();
  const transaction = await provider.sendTransaction(signedTransaction);
  return provider.getTransactionReceipt(transaction.hash);
};

const getContractMetadata = filepath => JSON.parse(fs.readFileSync(filepath, 'utf8'));

const deployContract = async (contractFilepath, uri, privateKey, constructorArgs) => {
  const wallet = getWallet(uri, privateKey);
  let contract;

  const contractJson = getContractMetadata(contractFilepath);

  const factory = new ethers.ContractFactory(
    contractJson.compilerOutput.abi,
    contractJson.compilerOutput.evm.bytecode,
    wallet,
  );
  // expect constructorArgs to be an array
  if (!Array.isArray(constructorArgs) || !constructorArgs.length) {
    contract = await factory.deploy();
  } else {
    contract = await factory.deploy(...constructorArgs);
  }
  const { address } = contract;
  const { hash } = contract.deployTransaction;

  // The contract is NOT deployed yet; it's only been sent to the mining pool; we must wait until it is mined
  await contract.deployed();

  return { address, hash };
};

/**
Links an already-deployed library's address to a not-yet-deployed contract's bytecode.
If we want to deploy a contract which will use an already-deployed library, then we need to replace (within the contract's bytecode) the 'placeholder' for the library with the library's address.
*/
const link = (bytecode, libraryName, libraryAddress) => {
  const address = libraryAddress.replace('0x', '');
  const { linkReferences } = bytecode;
  let qualifyingLibraryName;

  // We parse the bytecode's linkedReferences in search of the correct path of the library (in order to construct a correctly formatted qualifyingLibraryName)
  // eslint-disable-next-line no-restricted-syntax
  for (const entry of Object.entries(linkReferences)) {
    if (libraryName in entry[1]) {
      // From Solidity docs: Note that the fully qualified library name is the path of its source file and the library name separated by :.
      qualifyingLibraryName = `${entry[0]}:${libraryName}`;
      break;
    }
  }
  if (qualifyingLibraryName === undefined)
    throw new Error(`linkReference for library '${libraryName}' not found in contract's bytecode.`);

  const encodedLibraryName = utils
    .solidityKeccak256(['string'], [qualifyingLibraryName])
    .slice(2, 36);
  // console.log(`\nEncoded library name for ${qualifyingLibraryName}: ${encodedLibraryName}`);

  const pattern = new RegExp(`_+\\$${encodedLibraryName}\\$_+`, 'g');
  // ensure this particular library is being used by the contract (by checking for its encoded name within the contract's bytecode)
  if (!pattern.exec(bytecode.object)) {
    throw new Error(
      `Can't find the encoding ${encodedLibraryName} of ${libraryName}'s qualifying library name ${qualifyingLibraryName} in the contract's bytecode. It's possible that the library's path (i.e. the preimage of the keccak encoding) is incorrect.`,
    );
  }

  // swap out the placeholder with the library's deployed address:
  return bytecode.object.replace(pattern, address);
};

/**
Some contract need to refer to libraries which have already been deployed to an address. The contract's pre-deployment bytecode includes a 'blank space' into which the deployed library's address needs to be inserted.
This function inserts a deployed library's address into the bytecode, before then deploying the contract.
*/
const deployContractWithLibraryLink = async (
  contractFilepath,
  uri,
  privateKey,
  constructorArgs,
  libraryName,
  libraryAddress,
) => {
  const wallet = getWallet(uri, privateKey);
  let contract;
  const contractJson = getContractMetadata(contractFilepath);
  const { abi } = contractJson.compilerOutput;
  const { bytecode } = contractJson.compilerOutput.evm;

  const linkedBytecode = link(bytecode, libraryName, libraryAddress);

  const factory = new ethers.ContractFactory(abi, linkedBytecode, wallet);

  // expect constructorArgs to be an array
  if (!Array.isArray(constructorArgs) || !constructorArgs.length) {
    contract = await factory.deploy();
  } else {
    contract = await factory.deploy(...constructorArgs);
  }
  const { address } = contract;
  const { hash } = contract.deployTransaction;

  // The contract is NOT deployed yet; it's only been sent to the mining pool; we must wait until it is mined
  await contract.deployed();

  return { address, hash };
};

const getUnsignedContractDeployment = (contractJson, args = []) => {
  const factory = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode);

  const transaction = factory.getDeployTransaction(...args);
  return transaction.data;
};

const getContract = (contractJson, uri, address) => {
  try {
    const provider = getProvider(uri);
    return new ethers.Contract(address, contractJson.compilerOutput.abi, provider);
  } catch (e) {
    console.log('Failed to instantiate compiled contract', e);
  }
  return null;
};

const getContractWithWallet = (contractJson, contractAddress, uri, privateKey) => {
  let obt = null;
  try {
    const provider = getProvider(uri);
    const wallet = new ethers.Wallet(privateKey, provider);
    obt = new ethers.Contract(contractAddress, contractJson.compilerOutput.abi, provider);
    const contractWithWallet = obt.connect(wallet);
    return contractWithWallet;
  } catch (e) {
    console.log('Failed to instantiate compiled contract', e);
  }
  return obt;
};

const parseBigNumbers = object => {
  const output = { ...object };
  const entries = Object.entries(output);
  entries.forEach(([key, value]) => {
    if (key === '_hex') {
      output[key] = parseInt(value, 16);
    }
    if (value instanceof BigNumber) {
      output[key] = value.toNumber();
    }
  });
  return output;
};

const parseBigNumbersToIntArray = object => {
  const array = [];
  for (let i = 0; i < object.length; i += 1) {
    array.push(object[i].toNumber());
  }
  return array;
};

const parseBytes32ToStringArray = object => {
  const array = [];
  for (let i = 0; i < object.length; i += 1) {
    array.push(utils.parseBytes32String(object[i]));
  }
  return array;
};

const removeNumericKeys = obj => {
  if (typeof obj !== 'object') {
    throw new TypeError('Received something other than an object');
  }
  if (Array.isArray(obj)) {
    throw new TypeError('Received an array');
  }

  const newObject = {};
  const validKeys = Object.keys(obj).filter(key => Number.isNaN(Number(key)));
  validKeys.forEach(key => {
    newObject[key] = obj[key];
  });
  return newObject;
};

const getEvents = async (uri, contract, options) => {
  const { fromBlock = 0, toBlock = 'latest', topics } = options;

  const provider = getProvider(uri);

  const parsedTopic = topics ? ethers.utils.id(contract.interface.events[topics].signature) : null;

  const events = await provider.getLogs({
    fromBlock,
    toBlock,
    address: contract.address,
    topics: [parsedTopic],
  });

  const parsedEventData = events.map(log => contract.interface.parseLog(log));

  const combinedEventData = events.map((event, index) => {
    return {
      ...event,
      name: parsedEventData[index].name,
      values: parsedEventData[index].values,
    };
  });

  const output = combinedEventData.map(event => {
    return {
      ...event,
      values: removeNumericKeys(event.values),
    };
  });
  return output;
};

const retrieveEvents = (fromBlock, toBlock, eventType) => {
  let topics = eventType;
  if (eventType === 'allEvents') {
    topics = null;
  }
  const options = {
    fromBlock: fromBlock,
    toBlock: toBlock,
    topics: topics,
  };
  return getEvents(options);
};

const getTransactionCount = async (uri, address) => {
  const provider = getProvider(uri);
  const transactionCount = await provider.getTransactionCount(address);
  return transactionCount;
};

const getSignedTransaction = async (transaction, uri, privateKey) => {
  const wallet = await getWallet(uri, privateKey);
  const tx = {
    ...transaction,
    gasLimit: transaction.gasLimit || 100000000,
    nonce: transaction.nonce || (await getTransactionCount(uri, wallet.address)),
  };
  return wallet.sign(tx);
};

const getAccounts = async uri => {
  return getProvider(uri).listAccounts();
};

module.exports = {
  getProvider,
  getDefaultProvider,
  getWallet,
  getSigner,
  sendSignedTransaction,
  deployContract,
  deployContractWithLibraryLink,
  getUnsignedContractDeployment,
  getContract,
  parseBigNumbers,
  getEvents,
  getSignedTransaction,
  getTransactionCount,
  getAccounts,
  retrieveEvents,
  getContractWithWallet,
  removeNumericKeys,
  parseBigNumbersToIntArray,
  parseBytes32ToStringArray,
  getContractMetadata,
};
