const ethers = require('ethers');
const Wallet = require('./utils/wallet');
const Contract = require('./utils/contract');
const Organization = require('./utils/organization');
const Settings = require('./utils/settings');

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

  // Registering buyer in the OrganizationRegistry
  const buyerSettings = await getBuyerSettings();
  const { transactionHash: buyerRegistrationTxHash } = await Organization.registerToOrgRegistry(
    'buyer',
    organizationRegistryAddress,
    buyerWallet.signingKey.address,
    buyerSettings.organizationName,
    buyerSettings.organizationRole,
    buyerSettings.organizationWhisperKey,
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
    supplier1Settings.organizationWhisperKey,
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
    supplier2Settings.organizationWhisperKey,
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
    supplier3Settings.organizationWhisperKey,
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
  Settings.setServerSettings('buyer', { organizationRegistryAddress, globalRegistryAddress });
  Settings.setServerSettings('supplier1', { organizationRegistryAddress, globalRegistryAddress });
  Settings.setServerSettings('supplier2', { organizationRegistryAddress, globalRegistryAddress });
  Settings.setServerSettings('supplier3', { organizationRegistryAddress, globalRegistryAddress });

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
