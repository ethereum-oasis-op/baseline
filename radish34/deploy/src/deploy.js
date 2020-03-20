const { execSync } = require('child_process');
const fs = require('fs');
const ethers = require('ethers');
const Wallet = require('./utils/wallet');
const Contract = require('./utils/contract');
const Organization = require('./utils/organization');
const Settings = require('./utils/settings');
const { getWhisperIdentities } = require('./utils/identities');
const { uploadVks } = require('./utils/vk');

const addresses = {};
const pycryptoCliPath = 'pycrypto/cli.py';

const generateKeyPair = () => {
  let keys = {};
  if (fs.existsSync(pycryptoCliPath)) {
    const stdout = execSync(`python3 ${pycryptoCliPath} keygen`);
    const lines = stdout.toString().split(/\n/);
    const keypair = lines[0].split(/ /);
    if (keypair.length === 2) {
      keys['privateKey'] = `0x${keypair[0]}`;
      keys['publicKey'] = `0x${keypair[1]}`;
    }
  }

  return keys;
}

const deployContracts = async role => {
  addresses.ERC1820Registry = await Contract.deployContract('ERC1820Registry', [], role);
  console.log('✅  ERC1820Registry deployed:', addresses.ERC1820Registry);

  addresses.OrgRegistry = await Contract.deployContract(
    'OrgRegistry',
    [addresses.ERC1820Registry],
    role,
  );
  console.log('✅  OrgRegistry deployed:', addresses.OrgRegistry);

  addresses.BN256G2 = await Contract.deployContract('BN256G2', [], role);
  console.log('✅  BN256G2 library deployed:', addresses.BN256G2);

  addresses.Verifier = await Contract.deployContractWithLibraryLink(
    'Verifier',
    [addresses.ERC1820Registry],
    'BN256G2',
    role,
  );
  console.log('✅  Verifier deployed:', addresses.Verifier);

  addresses.Shield = await Contract.deployContract(
    'Shield',
    [addresses.Verifier, addresses.ERC1820Registry],
    role,
  );
  console.log('✅  Shield deployed:', addresses.Shield);
};

// TODO: Add managers for Shield and Verifier contracts
const assignManager = async role => {
  const { transactionHash } = await Organization.assignManager('OrgRegistry', role);
  console.log(`✅  Assigned the ${role} as the manager for OrgRegistry. TxHash:`, transactionHash);
};

// TODO: Add set interface implementers for Shield and Verifier contracts
const setInterfaceImplementer = async role => {
  const roleAddress = await Wallet.getAddress(role);
  const { transactionHash } = await Organization.setInterfaceImplementer(
    roleAddress,
    ethers.utils.id('IOrgRegistry'),
    addresses.OrgRegistry,
    role,
  );
  console.log(`✅  Set OrgRegistry as Interface Implementer for ${role}. TxHash:`, transactionHash);
};

// TODO Add a method to create commitment public key and private key for the user and receive these of the partners' from partners.
// Remove these fields from config. Or just the organisationzkpPrivateKey
const register = async role => {
  const roleAddress = await Wallet.getAddress(role);
  const config = await Settings.getServerSettings(role);
  let { organization } = config;
  const messengerKey = (await getWhisperIdentities())[role];
  organization = { ...organization, messengerKey };

  organization.address = roleAddress;
  if (!organization.zkpPublicKey) {
    const { privateKey, publicKey } = generateKeyPair();
    organization.zkpPublicKey = publicKey;
    organization.zkpPrivateKey = privateKey;
  }

  const { transactionHash } = await Organization.registerToOrgRegistry(
    role,
    addresses.OrgRegistry,
    organization.address,
    organization.name,
    organization.role,
    organization.messengerKey,
    organization.zkpPublicKey,
  );
  console.log(`✅  Registered ${role} in the OrgRegistry with tx hash:`, transactionHash);

  if (transactionHash) {
    Settings.setServerSettings(role, {
      addresses,
      organization,
    });
  }
};

const registerInterfaces = async role => {
  const { transactionHash } = await Organization.registerOrgInterfaces(
    role,
    addresses.OrgRegistry,
    'Radish34',
    // TODO: Deploy ERC1155 token and add deployed token address here
    '0x0000000000000000000000000000000000000000',
    addresses.Shield,
    addresses.Verifier,
  );
  console.log(
    `✅  Registered interfaces for shield & verifier with OrgRegistry with tx hash:`,
    transactionHash,
  );
};

const checkOrgCount = async () => {
  const registeredOrgCount = await Organization.getOrgCount(addresses.OrgRegistry, 'deployer');
  console.log(`✅  getOrg: ${registeredOrgCount} Organizations have successfully been set up!`);
};

const checkOrgInfo = async role => {
  const roleAddress = await Wallet.getAddress(role);
  const info = await Organization.getOrgInfo(addresses.OrgRegistry, roleAddress, 'deployer');
  console.log(info);
};

const saveSettings = async role => {
  const config = await Settings.getServerSettings(role);
  let { organization } = config;
  const messengerKey = (await getWhisperIdentities())[role];
  organization = { ...organization, messengerKey };
  Settings.setServerSettings(role, {
    addresses,
    organization,
  });
};

const main = async () => {
  await deployContracts('deployer');
  await assignManager('deployer');
  await setInterfaceImplementer('deployer');
  await register('buyer');
  await register('supplier1');
  await register('supplier2');
  await registerInterfaces('buyer');

  await checkOrgCount();
  await checkOrgInfo('buyer');
  await checkOrgInfo('supplier1');
  await checkOrgInfo('supplier2');

  await saveSettings('buyer');
  await saveSettings('supplier1');
  await saveSettings('supplier2');

  await uploadVks('deployer');

  console.log('----------------- Completed  -----------------');
  console.log(`Please restart the radish-apis for the config to take effect`);
};

console.log('Patiently waiting 10 seconds for ganache container to init ...');
setTimeout(() => {
  console.log('Checking for ganache ...');
  main();
}, 10000);
