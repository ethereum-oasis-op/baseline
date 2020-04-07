const path = require('path');
const assert = require('assert');
const ethers = require('ethers');

const RadishConfigpathContractsResolver = require('./resolvers/contract-resolvers/radish-configpath-resolver.js');
const RadishPathKeystoreDirResolver = require('./resolvers/keystore-resolvers/radish-keystore-dir-resolver.js');

const BaselineDeployer = require('./deployers/baseline-deployer.js');
const WorkgroupManager = require('./managers/workgroup-manager.js');

const main = async (pathKeystoreResolver, pathContractsResolver) => {

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER);

  const { ERC1820Registry, OrgRegistry, Verifier, Shield } = await deployContracts(pathKeystoreResolver, pathContractsResolver, provider);

  const workgroupManager = new WorkgroupManager(OrgRegistry, Verifier, Shield);

  const transaction = await workgroupManager.registerOrganisation();

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

  const { ERC1820Registry } = await baselineDeployer.deployProtocol(buildProtocolTask);
  console.log('✅  ERC1820Registry deployed:', ERC1820Registry.contractAddress);

  const workgroupBuilder = baselineDeployer.getWorkgroupBuilder(pathContractsResolver);
  const buildWorkgroupTask = await workgroupBuilder
    .addOrgRegistry(ERC1820Registry.contractAddress)
    .addShield(ERC1820Registry.contractAddress)
    .build();

  const { OrgRegistry, Verifier, Shield } = await baselineDeployer.deployWorkgroup(buildWorkgroupTask);

  console.log('✅  OrgRegistry deployed:', OrgRegistry.contractAddress);
  console.log('✅  Verifier deployed:', Verifier.contractAddress);
  console.log('✅  Shield deployed:', Shield.contractAddress);

  return {
    ERC1820Registry,
    OrgRegistry,
    Verifier,
    Shield
  }
  
}

const run = async () => {

  assert(typeof process.env.KEYSTORE_PATH === 'string', "KEYSTORE_PATH not provided or not string");
  assert(typeof process.env.RPC_PROVIDER === 'string', "RPC_PROVIDER not provided or not string");

  let keystoreDir = path.resolve(process.env.KEYSTORE_PATH);
  let paths = (process.env.CONTRACTS_PATH) ? path.resolve(process.env.CONTRACTS_PATH) : undefined;

  const pathKeystoreResolver = new RadishPathKeystoreDirResolver(keystoreDir)
  const pathContractsResolver = new RadishConfigpathContractsResolver(paths);

  console.log('Patiently waiting 10 seconds for ganache container to init ...');
  setTimeout(async () => {
    console.log('Checking for ganache ...');
    await main(pathKeystoreResolver, pathContractsResolver);
  }, 500);
}

run()