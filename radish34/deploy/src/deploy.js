const path = require('path');
const assert = require('assert');
const ethers = require('ethers');
<<<<<<< HEAD

const RadishConfigpathContractsResolver = require('./baseline-administrator-lib/resolvers/contract-resolvers/radish-configpath-resolver.js');
const RadishPathKeystoreDirResolver = require('./baseline-administrator-lib/resolvers/keystore-resolvers/radish-keystore-dir-resolver.js');
const RadishOrganisationConfigpathResolver = require('./baseline-administrator-lib/resolvers/organisation-resolvers/radish-configpath-resolver.js');
const RadishZKPRestResolver = require('./baseline-administrator-lib/resolvers/verification-key-resolvers/radish-zkp-rest-resolver');

const BaselineDeployer = require('./baseline-administrator-lib/deployers/baseline-deployer.js');
const BaselineWorkgroupManager = require('./baseline-administrator-lib/managers/baseline-workgroup-manager.js');
=======
const Wallet = require('./utils/wallet');
const Contract = require('./utils/contract');
const Organization = require('./utils/organization');
const Settings = require('./utils/settings');
const { getWhisperIdentities } = require('./utils/identities');
const { uploadVks } = require('./utils/vk');

const addresses = {};

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

  const { transactionHash } = await Organization.registerToOrgRegistry(
    role,
    addresses.OrgRegistry,
    roleAddress,
    organization.name,
    organization.role,
    organization.messengerKey,
    organization.zkpPublicKey,
  );
  console.log(`✅  Registered ${role} in the OrgRegistry with tx hash:`, transactionHash);
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
>>>>>>> 101517cef902417e10bd7e363ba1ac08c57a9a37

const SettingsSaver = require('./utils/SettingsSaver');

const main = async (radishOrganisations, pathKeystoreResolver, pathContractsResolver, pathOrganisationResolver, zkpVerificationKeyResolver, provider, settingsSaver) => {

  const {
    ERC1820Registry,
    OrgRegistry,
    Verifier,
    Shield
  } = await deployContracts(pathKeystoreResolver, pathContractsResolver, provider);

<<<<<<< HEAD
  const workgroupManager = new BaselineWorkgroupManager(OrgRegistry, Verifier, Shield);
=======
const main = async () => {
>>>>>>> 101517cef902417e10bd7e363ba1ac08c57a9a37

  for (const organisation of radishOrganisations) {
    console.log(`ℹ️   Registering workgroup member: ${organisation.name}`);
    await registerOrganisation(workgroupManager, pathKeystoreResolver, pathOrganisationResolver, organisation.name, organisation.messengerUri);
    await registerOrganisationInterfaceImplementers(ERC1820Registry, OrgRegistry, Shield, Verifier, pathKeystoreResolver, organisation.name);
  }
  await registerRadishInterface(workgroupManager, Shield, Verifier);

  console.log(`ℹ️   Registering zkp verification keys`);
  await registerVerificationKey(workgroupManager, zkpVerificationKeyResolver, 'createMSA');
  await registerVerificationKey(workgroupManager, zkpVerificationKeyResolver, 'createPO');

  console.log(`ℹ️   Network information:`);
  await printNetworkInfo(workgroupManager, radishOrganisations, pathKeystoreResolver);

  for (const organisation of radishOrganisations) {
    console.log(`ℹ️   Saving settings to config file for: ${organisation.name}`);
    await saveOrganisationConfig(settingsSaver, organisation.name, organisation.messengerUri, {
      ERC1820Registry: ERC1820Registry.address,
      OrgRegistry: OrgRegistry.address,
      Verifier: Verifier.address,
      Shield: Shield.address
    })
  }

  console.log('----------------- Completed  -----------------');
  console.log(`Please restart the radish-apis for the config to take effect`);

  // TODO set manager if needed - this might not be needed - double check
  // Update Radish34 Docs
  // Deploy README - Diagrams - objects, classes
  // TODO Javascript docs
  // Remove old files

};

const deployContracts = async (pathKeystoreResolver, pathContractsResolver, provider) => {
  const deployerWallet = await pathKeystoreResolver.getWallet('deployer');

  const baselineDeployer = new BaselineDeployer(deployerWallet, provider);

  const protocolBuilder = baselineDeployer.getProtocolBuilder(pathContractsResolver);
  const buildProtocolTask = await protocolBuilder
    .addErc1820Registry()
    .build();

  const {
    ERC1820Registry
  } = await baselineDeployer.deployProtocol(buildProtocolTask);
  console.log('✅  ERC1820Registry deployed:', ERC1820Registry.address);

  const workgroupBuilder = baselineDeployer.getWorkgroupBuilder(pathContractsResolver);
  const buildWorkgroupTask = await workgroupBuilder
    .addOrgRegistry(ERC1820Registry.address)
    .addShield(ERC1820Registry.address)
    .build();

  const {
    OrgRegistry,
    Verifier,
    Shield
  } = await baselineDeployer.deployWorkgroup(buildWorkgroupTask);

  console.log('✅  OrgRegistry deployed:', OrgRegistry.address);
  console.log('✅  Verifier deployed:', Verifier.address);
  console.log('✅  Shield deployed:', Shield.address);

  return {
    ERC1820Registry,
    OrgRegistry,
    Verifier,
    Shield
  }

}

const registerOrganisation = async (workgroupManager, pathKeystoreResolver, organisationResolver, organisationName, organisationMessengerURL) => {
  const buyerWallet = await pathKeystoreResolver.getWallet(organisationName);
  const organisation = await organisationResolver.resolve(organisationName, organisationMessengerURL);
  const transaction = await workgroupManager.registerOrganisation(buyerWallet.address, organisation.name, organisation.role, organisation.messagingKey, organisation.zkpPublicKey);

  console.log(`✅  Registered ${organisationName} in the OrgRegistry with transaction hash: ${transaction.transactionHash}`);
}

const registerRadishInterface = async (workgroupManager, shieldContract, verifierContract) => {
  const transaction = await workgroupManager.registerOrganisationInterfaces('Radish34', ethers.constants.AddressZero, shieldContract.address, verifierContract.address);

  console.log(`✅  Registered the Radish34 interface in the OrgRegistry with transaction hash: ${transaction.transactionHash}`);
}

const registerOrganisationInterfaceImplementers = async (erc1820Contract, OrgRegistryContract, ShieldContract, VerifierContract, keystoreResolver, organisationName) => {
  const organisationWallet = await keystoreResolver.getWallet(organisationName);
  const organisationErc1820Instance = await erc1820Contract.connect(organisationWallet);
  const organisationAddress = await organisationWallet.getAddress();
  const orgRegistryTransaction = await organisationErc1820Instance.setInterfaceImplementer(organisationAddress, ethers.utils.id('IOrgRegistry'), OrgRegistryContract.address);
  const orgRegistryReceipt = await orgRegistryTransaction.wait();

  const verifierTransaction = await organisationErc1820Instance.setInterfaceImplementer(organisationAddress, ethers.utils.id('IVerifier'), VerifierContract.address);
  const verifierReceipt = await verifierTransaction.wait();

  const shieldTransaction = await organisationErc1820Instance.setInterfaceImplementer(organisationAddress, ethers.utils.id('IShield'), ShieldContract.address);
  const shieldReceipt = await shieldTransaction.wait();

  console.log(`✅  Registered OrgRegistry as IOrgRegistry for ${organisationName} with transaction hash: ${orgRegistryReceipt.transactionHash}`);
  console.log(`✅  Registered Verifier as IVerifier for ${organisationName} with transaction hash: ${verifierReceipt.transactionHash}`);
  console.log(`✅  Registered Shield as IShield for ${organisationName} with transaction hash: ${shieldReceipt.transactionHash}`);
}

const registerVerificationKey = async (workgroupManager, verificationKeyResolver, circuitName) => {
  const transaction = await workgroupManager.registerVerificationKey(verificationKeyResolver, circuitName);

  console.log(`✅  Registered verification key for ${circuitName} with transaction hash: ${transaction.transactionHash}`);
}

const printNetworkInfo = async (workgroupManager, radishOrganisations, keystoreResolver) => {
  const registeredOrgCount = await workgroupManager.getOrganisationsCount();
  console.log(`✅  Radish network of ${registeredOrgCount.toString(10)} organizations have successfully been set up!`);
  for (const organisation of radishOrganisations) {
    const organisationWallet = await keystoreResolver.getWallet(organisation.name);
    const organisationAddress = await organisationWallet.getAddress();
    const organisationInfo = await workgroupManager.getOrganisationInfo(organisationAddress);
    console.log(`✅  Information about ${organisation.name}: ${organisationInfo}`);
  }
};

const saveOrganisationConfig = async (settingsSaver, organisationName, organisationWhisperURL, addresses) => {
  const settings = await settingsSaver.updateSettings(organisationName, organisationWhisperURL, addresses)
  console.log(`✅  Saved information about ${organisationName}: ${JSON.stringify(settings)}`);
}

const run = async () => {

  assert(typeof process.env.KEYSTORE_PATH === 'string', "KEYSTORE_PATH not provided or not string");
  assert(typeof process.env.ORGANISATION_CONFIG_PATH === 'string', "ORGANISATION_CONFIG_PATH not provided or not string");
  assert(typeof process.env.RPC_PROVIDER === 'string', "RPC_PROVIDER not provided or not string");
  assert(typeof process.env.ZKP_URL === 'string', "ZKP_URL not provided or not string");

  assert(typeof process.env.MESSENGER_BUYER_URI === 'string', "MESSENGER_BUYER_URI not provided or not string");
  assert(typeof process.env.MESSENGER_SUPPLIER1_URI === 'string', "MESSENGER_SUPPLIER1_URI not provided or not string");
  assert(typeof process.env.MESSENGER_SUPPLIER2_URI === 'string', "MESSENGER_SUPPLIER2_URI not provided or not string");

  let keystoreDir = path.resolve(process.env.KEYSTORE_PATH);
  let organisationsConfigDir = path.resolve(process.env.ORGANISATION_CONFIG_PATH);
  let paths = (process.env.CONTRACTS_PATH) ? path.resolve(process.env.CONTRACTS_PATH) : undefined;

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER);
  const pathKeystoreResolver = new RadishPathKeystoreDirResolver(keystoreDir, provider);
  const pathContractsResolver = new RadishConfigpathContractsResolver(paths);
  const pathOrganisationResolver = new RadishOrganisationConfigpathResolver(organisationsConfigDir);
  const zkpVerificationKeyResolver = new RadishZKPRestResolver(process.env.ZKP_URL);
  const settingsSaver = new SettingsSaver(organisationsConfigDir, process.env.RPC_PROVIDER);

  // TODO get this from param
  const radishOrganisations = [{
      name: 'buyer',
      messengerUri: process.env.MESSENGER_BUYER_URI
    },
    {
      name: 'supplier1',
      messengerUri: process.env.MESSENGER_SUPPLIER1_URI
    },
    {
      name: 'supplier2',
      messengerUri: process.env.MESSENGER_SUPPLIER2_URI
    }
  ]

  console.log('Patiently waiting 10 seconds for ganache container to init ...');
  setTimeout(async () => {
    console.log('Checking for ganache ...');
    await main(radishOrganisations, pathKeystoreResolver, pathContractsResolver, pathOrganisationResolver, zkpVerificationKeyResolver, provider, settingsSaver);
  }, 10000);
}

run()