const ethers = require('ethers');
const Wallet = require('./utils/wallet');
const Contract = require('./utils/contract');
const Organization = require('./utils/organization');
const Settings = require('./utils/settings');
const { getIdentities } = require('./utils/identities');

let globalRegistryAddress;
let organizationRegistryAddress;

const deployContracts = async role => {
  globalRegistryAddress = await Contract.deployERC1820Registry(role);
  console.log('✅  Registry Deployed:', globalRegistryAddress);
  organizationRegistryAddress = await Contract.deployOrgRegistry(role);
  console.log('✅  OrganizationRegistry Deployed:', organizationRegistryAddress);
};

const assignManager = async role => {
  const { signingKey } = await Wallet.getWallet(role);
  const { transactionHash: assignManagerTxHash } = await Organization.assignManager(
    organizationRegistryAddress,
    signingKey.address,
  );
  console.log(`✅  Assigned the ${role} as the manager:`, assignManagerTxHash);
};

const setInterfaceImplementer = async role => {
  const { signingKey } = await Wallet.getWallet(role);
  const {
    transactionHash: setInterfaceImplementerTxHash,
  } = await Organization.setInterfaceImplementer(
    signingKey.address,
    ethers.utils.id('IOrgRegistry'),
    organizationRegistryAddress,
  );
  console.log(
    `✅  Set OrgReg as Interface Implementer for ${role}:`,
    setInterfaceImplementerTxHash,
  );
};

const register = async role => {
  const { organizationName, organizationRole } = await Settings.getServerSettings(role);
  const { signingKey } = await Wallet.getWallet(role);
  const ids = await getIdentities();
  const { transactionHash } = await Organization.registerToOrgRegistry(
    role,
    organizationRegistryAddress,
    signingKey.address,
    organizationName,
    organizationRole,
    ids[role],
  );
  console.log(`✅  Registered ${role} in the OrgReg with tx hash:`, transactionHash);
};

const checkOrgCount = async () => {
  const registeredOrgCount = await Organization.getOrgCount(organizationRegistryAddress);
  console.log(`✅  getOrg: ${registeredOrgCount} Organizations have successfully been set up!`);
};

const checkOrgInfo = async role => {
  const { signingKey } = await Wallet.getWallet(role);
  const info = await Organization.getOrgInfo(organizationRegistryAddress, signingKey.address);
  console.log(info);
};

const saveSettings = async role => {
  const { organizationName, organizationRole } = await Settings.getServerSettings(role);
  const ids = await getIdentities();

  Settings.setServerSettings(role, {
    organizationRegistryAddress,
    globalRegistryAddress,
    organizationName,
    organizationRole,
    organizationWhisperKey: ids[`${role}`],
  });
};

const main = async () => {
  const registerAll = process.env.MODE === 'register-all';

  await deployContracts('buyer');
  await assignManager('buyer');
  await setInterfaceImplementer('buyer');
  await register('buyer');
  await register('supplier1');
  await register('supplier2');
  if (registerAll) {
    await register('supplier3');
  }
  await checkOrgCount();
  await checkOrgInfo('buyer');
  await checkOrgInfo('supplier1');
  await checkOrgInfo('supplier2');
  if (registerAll) {
    await checkOrgInfo('supplier3');
  }
  await saveSettings('buyer');
  await saveSettings('supplier1');
  await saveSettings('supplier2');
  if (!registerAll) {
    await saveSettings('supplier3');
  }

  console.log('----------------- Completed  -----------------');
  console.log(`
    Please restart the radish-apis for the config to take effect
  `);
};

console.log('Patiently waiting 10 seconds for ganache container to init ...');
setTimeout(() => {
  console.log('Checking for ganache ...');
  main();
}, 10000);
