const path = require('path');
const assert = require('assert');
const ethers = require('ethers');

const RadishPathContractsResolver = require('./resolvers/contract-resolvers/radish-path-resolver.js');
const RadishPathKeystoreResolver = require('./resolvers/keystore-resolvers/radish-path-resolver.js');

const BaselineDeployer = require('./deployers/baseline-deployer.js');

const main = async (pathKeystoreResolver, pathContractsResolver) => {

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER);

  await deployContracts(pathKeystoreResolver, pathContractsResolver, provider);


};

const deployContracts = async (pathKeystoreResolver, pathContractsResolver, provider) => {
  const deployerWallet = pathKeystoreResolver.getWallet('deployer');

  const baselineDeployer = new BaselineDeployer(deployerWallet, provider);

  const protocolBuilder = baselineDeployer.getProtocolBuilder(pathContractsResolver);
  const buildProtocolTask = protocolBuilder
    .addErc1820Registry()
    .build();

  const deployedProtocolContracts = await baselineDeployer.deployProtocol(buildProtocolTask);
  console.log('✅  ERC1820Registry deployed:', deployedProtocolContracts.ERC1820Registry.contractAddress);

  const workgroupBuilder = baselineDeployer.getWorkgroupBuilder(pathContractsResolver);
  const buildWorkgroupTask = workgroupBuilder
    .addOrgRegistry(deployedProtocolContracts.ERC1820Registry.contractAddress)
    .addShield(deployedProtocolContracts.ERC1820Registry.contractAddress)
    .build();

  const deployedWorkgroupContracts = await baselineDeployer.deployWorkgroup(buildWorkgroupTask);

  console.log('✅  OrgRegistry deployed:', deployedWorkgroupContracts.OrgRegistry.contractAddress);
  console.log('✅  Verifier deployed:', deployedWorkgroupContracts.Verifier.contractAddress);
  console.log('✅  Shield deployed:', deployedWorkgroupContracts.Shield.contractAddress);
}


const run = async () => {

  assert(typeof process.env.KEYSTORE_PATH === 'string', "KEYSTORE_PATH not provided or not string");
  assert(typeof process.env.RPC_PROVIDER === 'string', "RPC_PROVIDER not provided or not string");

  let keystoreDir = path.resolve(process.env.KEYSTORE_PATH);
  let paths = (process.env.CONTRACTS_PATH) ? path.resolve(process.env.CONTRACTS_PATH) : undefined;

  const pathKeystoreResolver = new RadishPathKeystoreResolver(keystoreDir)
  const pathContractsResolver = new RadishPathContractsResolver(paths);

  console.log('Patiently waiting 10 seconds for ganache container to init ...');
  setTimeout(async () => {
    console.log('Checking for ganache ...');
    await main(pathKeystoreResolver, pathContractsResolver);
  }, 500);
}

run()