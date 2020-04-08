const path = require('path');
const assert = require('assert');
const ethers = require('ethers');

const RadishConfigpathContractsResolver = require('./resolvers/contract-resolvers/radish-configpath-resolver.js');
const RadishPathKeystoreDirResolver = require('./resolvers/keystore-resolvers/radish-keystore-dir-resolver.js');
const RadishOrganisationConfigpathResolver = require('./resolvers/organisation-resolvers/radish-configpath-resolver.js');

const BaselineDeployer = require('./deployers/baseline-deployer.js');
const WorkgroupManager = require('./managers/baseline-workgroup-manager.js');

const main = async (pathKeystoreResolver, pathContractsResolver, pathOrganisationResolver, provider) => {

  const {
    ERC1820Registry,
    OrgRegistry,
    Verifier,
    Shield
  } = await deployContracts(pathKeystoreResolver, pathContractsResolver, provider);

  const workgroupManager = new WorkgroupManager(OrgRegistry, Verifier, Shield);
  workgroupManager.setOrganisationResolver(pathOrganisationResolver);
  await registerParty(workgroupManager, pathKeystoreResolver, 'buyer', process.env.MESSENGER_BUYER_URI);
  await registerParty(workgroupManager, pathKeystoreResolver, 'supplier1', process.env.MESSENGER_SUPPLIER1_URI);
  await registerParty(workgroupManager, pathKeystoreResolver, 'supplier2', process.env.MESSENGER_SUPPLIER2_URI);

  await registerRadishInterface(workgroupManager, Shield, Verifier);

  await registerOrganisationInterfaceImplementers(ERC1820Registry, OrgRegistry, Shield, Verifier, pathKeystoreResolver, 'buyer')
  await registerOrganisationInterfaceImplementers(ERC1820Registry, OrgRegistry, Shield, Verifier, pathKeystoreResolver, 'supplier1')
  await registerOrganisationInterfaceImplementers(ERC1820Registry, OrgRegistry, Shield, Verifier, pathKeystoreResolver, 'supplier2')

  // TODO set manager if needed - this might not be needed - double check
  // TODO set interface implementer if needed - this is needed to set the organisation implementers

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

const registerParty = async (workgroupManager, pathKeystoreResolver, partyName, partyMessangerURL) => {
  const buyerWallet = await pathKeystoreResolver.getWallet(partyName);
  const transaction = await workgroupManager.registerOrganisation(partyName, buyerWallet.address, partyMessangerURL);

  console.log(`✅  Registered ${partyName} in the OrgRegistry with transaction hash: ${transaction.transactionHash}`);
}

const registerRadishInterface = async (workgroupManager, shieldContract, verifierContract) => {
  const transaction = await workgroupManager.registerOrganisationInterfaces('Radish34', ethers.constants.AddressZero, shieldContract.address, verifierContract.address);

  console.log(`✅  Registered the Radish34 interface in the OrgRegistry with transaction hash: ${transaction.transactionHash}`);
}

const registerOrganisationInterfaceImplementers = async (erc1820Contract, OrgRegistryContract, ShieldContract, VerifierContract, keystoreResolver, partyName) => {
  const partyWallet = await keystoreResolver.getWallet(partyName);
  const partyErc1820ContractInstance = await erc1820Contract.connect(partyWallet);
  const partyAddress = await partyWallet.getAddress();
  const orgRegistryTransaction = await partyErc1820ContractInstance.setInterfaceImplementer(partyAddress, ethers.utils.id('IOrgRegistry'), OrgRegistryContract.address);
  const orgRegistryReceipt = await orgRegistryTransaction.wait();

  const verifierTransaction = await partyErc1820ContractInstance.setInterfaceImplementer(partyAddress, ethers.utils.id('IVerifier'), VerifierContract.address);
  const verifierReceipt = await verifierTransaction.wait();

  const shieldTransaction = await partyErc1820ContractInstance.setInterfaceImplementer(partyAddress, ethers.utils.id('IShield'), ShieldContract.address);
  const shieldReceipt = await shieldTransaction.wait();

  console.log(`✅  Registered OrgRegistry as IOrgRegistry for ${partyName} with transaction hash: ${orgRegistryReceipt.transactionHash}`);
  console.log(`✅  Registered Verifier as IVerifier for ${partyName} with transaction hash: ${verifierReceipt.transactionHash}`);
  console.log(`✅  Registered Shield as IShield for ${partyName} with transaction hash: ${shieldReceipt.transactionHash}`);
}

const run = async () => {

  assert(typeof process.env.KEYSTORE_PATH === 'string', "KEYSTORE_PATH not provided or not string");
  assert(typeof process.env.ORGANISATION_CONFIG_PATH === 'string', "ORGANISATION_CONFIG_PATH not provided or not string");
  assert(typeof process.env.RPC_PROVIDER === 'string', "RPC_PROVIDER not provided or not string");

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

  console.log('Patiently waiting 10 seconds for ganache container to init ...');
  setTimeout(async () => {
    console.log('Checking for ganache ...');
    await main(pathKeystoreResolver, pathContractsResolver, pathOrganisationResolver, provider);
  }, 500);
}

run()