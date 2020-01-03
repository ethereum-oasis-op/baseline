const ethers = require('ethers');
const Wallet = require('./utils/wallet');
const Contract = require('./utils/contract');
const Organization = require('./utils/organization');
const Settings = require('./utils/settings');

const axios = require('axios');
const MESSENGER_BUYER_URI = process.env.MESSENGER_BUYER_URI;
const MESSENGER_SUPPLIER1_URI = process.env.MESSENGER_SUPPLIER1_URI;
const MESSENGER_SUPPLIER2_URI = process.env.MESSENGER_SUPPLIER2_URI;
const MESSENGER_SUPPLIER3_URI = process.env.MESSENGER_SUPPLIER3_URI;

const buyerWallet = Wallet.getWallet('buyer');
const supplier1Wallet = Wallet.getWallet('supplier1');
const supplier2Wallet = Wallet.getWallet('supplier2');
const supplier3Wallet = Wallet.getWallet('supplier3');

const getBuyerSettings = () => Settings.getServerSettings('buyer');
const getSupplier1Settings = () => Settings.getServerSettings('supplier1');
const getSupplier2Settings = () => Settings.getServerSettings('supplier2');
const getSupplier3Settings = () => Settings.getServerSettings('supplier3');

const main = async () => {
  // Deploy Registry Contract
  const globalRegistryAddress = await Contract.deployERC1820Registry();
  console.log('✅  Registry Deployed:', globalRegistryAddress);

  const organizationRegistryAddress = await Contract.deployOrgRegistry();
  console.log('✅  OrganizationRegistry Deployed:', organizationRegistryAddress);

  // Setting Manager
  const { transactionHash: assignManagerTxHash } = await Organization.assignManager(
    organizationRegistryAddress,
    buyerWallet.signingKey.address,
  );
  console.log('✅  Assigned the buyer as the manager:', assignManagerTxHash);

  // Setting Interface Implementer
  const {
    transactionHash: setInterfaceImplementerTxHash,
  } = await Organization.setInterfaceImplementer(
    buyerWallet.signingKey.address,
    ethers.utils.id('IOrgRegistry'),
    organizationRegistryAddress,
  );
  console.log('✅  Set OrgReg as Interface Implementer for buyer:', setInterfaceImplementerTxHash);

  console.log('------------- Retrieve Whisper Identities -------------');
  let whisperId_buyer;
  let whisperId_supplier1;
  let whisperId_supplier2;
  let whisperId_supplier3;
  try {
    let result = await axios.get(`${MESSENGER_BUYER_URI}/identities`);
    whisperId_buyer = result.data[0].publicKey;
    console.log('whisperId_buyer =', whisperId_buyer);
    let result2 = await axios.get(`${MESSENGER_SUPPLIER1_URI}/identities`);
    whisperId_supplier1 = result2.data[0].publicKey;
    console.log('whisperId_supplier1 =', whisperId_supplier1);
    result = await axios.get(`${MESSENGER_SUPPLIER2_URI}/identities`);
    whisperId_supplier2 = result.data[0].publicKey;
    console.log('whisperId_supplier2 =', whisperId_supplier2);
    result = await axios.get(`${MESSENGER_SUPPLIER3_URI}/identities`);
    whisperId_supplier3 = result.data[0].publicKey;
    console.log('whisperId_supplier3 =', whisperId_supplier3);
  } catch (error) {
    console.log('Could not retrieve Whisper ID. Check health of MESSENGER services:', error);
    return process.exit(1);
  };
  console.log('✅  Retrieved all Whisper Identity for each user');

  // Registering buyer in the OrganizationRegistry
  const buyerSettings = await getBuyerSettings();
  const { transactionHash: buyerRegistrationTxHash } = await Organization.registerToOrgRegistry(
    'buyer',
    organizationRegistryAddress,
    buyerWallet.signingKey.address,
    buyerSettings.organizationName,
    buyerSettings.organizationRole,
    whisperId_buyer,
  );
  console.log('✅  Registered Buyer in the OrgReg', buyerRegistrationTxHash);

  // Registering supplier1 in the OrganizationRegistry
  const supplier1Settings = await getSupplier1Settings();
  const { transactionHash: supplier1RegistrationTxHash } = await Organization.registerToOrgRegistry(
    'supplier1',
    organizationRegistryAddress,
    supplier1Wallet.signingKey.address,
    supplier1Settings.organizationName,
    supplier1Settings.organizationRole,
    whisperId_supplier1,
  );
  console.log('✅  Registered Supplier1 in the OrgReg', supplier1RegistrationTxHash);

  // Registering supplier2 in the OrganizationRegistry
  const supplier2Settings = await getSupplier2Settings();
  const { transactionHash: supplier2RegistrationTxHash } = await Organization.registerToOrgRegistry(
    'supplier2',
    organizationRegistryAddress,
    supplier2Wallet.signingKey.address,
    supplier2Settings.organizationName,
    supplier2Settings.organizationRole,
    whisperId_supplier2,
  );
  console.log('✅  Registered Supplier2 in the OrgReg', supplier2RegistrationTxHash);

  // Registering supplier3 in the OrganizationRegistry
  const supplier3Settings = await getSupplier3Settings();
  const { transactionHash: supplier3RegistrationTxHash } = await Organization.registerToOrgRegistry(
    'supplier3',
    organizationRegistryAddress,
    supplier3Wallet.signingKey.address,
    supplier3Settings.organizationName,
    supplier3Settings.organizationRole,
    whisperId_supplier2,
  );
  console.log('✅  Registered Supplier3 in the OrgReg', supplier3RegistrationTxHash);

  console.log('----------------- Calling getOrgCount on contracts -----------------');
  const registeredOrgCount = await Organization.getOrgCount(organizationRegistryAddress);
  const buyerAddress = buyerWallet.signingKey.address;
  const supplier1Address = supplier1Wallet.signingKey.address;
  const supplier2Address = supplier2Wallet.signingKey.address;
  const supplier3Address = supplier3Wallet.signingKey.address;

  console.log(`✅  getOrg: ${registeredOrgCount} Organizations have successfully been set up!`);
  const buyerInfo = await Organization.getOrgInfo(organizationRegistryAddress, buyerAddress);
  const supplier1Info = await Organization.getOrgInfo(organizationRegistryAddress, supplier1Address);
  const supplier2Info = await Organization.getOrgInfo(organizationRegistryAddress, supplier2Address);
  const supplier3Info = await Organization.getOrgInfo(organizationRegistryAddress, supplier3Address);

  console.log('----------------- Calling getOrg on contracts -----------------');
  console.log({
    buyerInfo,
    supplier1Info,
    supplier2Info,
    supplier3Info,
  });

  console.log('----------------- Updating config files  -----------------');
  Settings.setServerSettings('buyer', { organizationRegistryAddress, globalRegistryAddress, organizationWhisperKey: whisperId_buyer });
  Settings.setServerSettings('supplier1', { organizationRegistryAddress, globalRegistryAddress, organizationWhisperKey: whisperId_supplier1 });
  Settings.setServerSettings('supplier2', { organizationRegistryAddress, globalRegistryAddress, organizationWhisperKey: whisperId_supplier2 });
  Settings.setServerSettings('supplier3', { organizationRegistryAddress, globalRegistryAddress, organizationWhisperKey: whisperId_supplier3 });

  console.log('----------------- Done  -----------------');
  console.log(`
    Please restart the radish-apis for the config to take effect
  `);
};

console.log('Patiently waiting 10 seconds for ganache container to init ...');
setTimeout(() => {
  console.log('Checking for ganache ...');
  main();
}, 10000);
