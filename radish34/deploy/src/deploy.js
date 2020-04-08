const path = require('path');
const assert = require('assert');
const ethers = require('ethers');

const RadishConfigpathContractsResolver = require('./resolvers/contract-resolvers/radish-configpath-resolver.js');
const RadishPathKeystoreDirResolver = require('./resolvers/keystore-resolvers/radish-keystore-dir-resolver.js');
const RadishOrganisationConfigpathResolver = require('./resolvers/organisation-resolvers/radish-configpath-resolver.js');
const RadishZKPRestResolver = require('./resolvers/verification-key-resolvers/radish-zkp-rest-resolver');

const BaselineDeployer = require('./deployers/baseline-deployer.js');
const WorkgroupManager = require('./managers/baseline-workgroup-manager.js');

const main = async (radishOrganisations, pathKeystoreResolver, pathContractsResolver, pathOrganisationResolver, zkpVerificationKeyResolver, provider) => {

  const {
    ERC1820Registry,
    OrgRegistry,
    Verifier,
    Shield
  } = await deployContracts(pathKeystoreResolver, pathContractsResolver, provider);

  const workgroupManager = new WorkgroupManager(OrgRegistry, Verifier, Shield);
  workgroupManager.setOrganisationResolver(pathOrganisationResolver);

  for (const organisation of radishOrganisations) {
    console.log(`ℹ️   Registering workgroup member: ${organisation.name}`);
    await registerOrganisation(workgroupManager, pathKeystoreResolver, organisation.name, organisation.messengerUri);
    await registerOrganisationInterfaceImplementers(ERC1820Registry, OrgRegistry, Shield, Verifier, pathKeystoreResolver, organisation.name);
  }
  await registerRadishInterface(workgroupManager, Shield, Verifier);

  console.log(`ℹ️   Registering zkp verification keys`);
  await registerVerificationKey(workgroupManager, zkpVerificationKeyResolver, 'createMSA');
  await registerVerificationKey(workgroupManager, zkpVerificationKeyResolver, 'createPO');

  console.log(`ℹ️   Network information:`);
  await printNetworkInfo(workgroupManager, radishOrganisations, pathKeystoreResolver);

  // TODO set manager if needed - this might not be needed - double check

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

const registerOrganisation = async (workgroupManager, pathKeystoreResolver, organisationName, organisationMessengerURL) => {
  const buyerWallet = await pathKeystoreResolver.getWallet(organisationName);
  const transaction = await workgroupManager.registerOrganisation(organisationName, buyerWallet.address, organisationMessengerURL);

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
  const pathKeystoreResolver = new RadishPathKeystoreDirResolver(keystoreDir, provider)
  const pathContractsResolver = new RadishConfigpathContractsResolver(paths);
  const pathOrganisationResolver = new RadishOrganisationConfigpathResolver(organisationsConfigDir)
  const zkpVerificationKeyResolver = new RadishZKPRestResolver(process.env.ZKP_URL)

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
    await main(radishOrganisations, pathKeystoreResolver, pathContractsResolver, pathOrganisationResolver, zkpVerificationKeyResolver, provider);
  }, 500);
}

run()