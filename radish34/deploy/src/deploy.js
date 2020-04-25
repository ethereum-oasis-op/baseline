const path = require('path');
const assert = require('assert');
const ethers = require('ethers');

const RadishConfigpathContractsResolver = require('./baseline-administrator-lib/resolvers/contract-resolvers/radish-configpath-resolver.js');
const RadishPathKeystoreDirResolver = require('./baseline-administrator-lib/resolvers/keystore-resolvers/radish-keystore-dir-resolver.js');
const RadishOrganisationConfigpathResolver = require('./baseline-administrator-lib/resolvers/organisation-resolvers/radish-configpath-resolver.js');
const RadishMessengerKeyRestResolver = require('./baseline-administrator-lib/resolvers/organisation-resolvers/radish-messenger-key-rest-resolver.js');
const RadishZKPRestResolver = require('./baseline-administrator-lib/resolvers/verification-key-resolvers/radish-zkp-rest-resolver');

const BaselineDeployer = require('./baseline-administrator-lib/deployers/baseline-deployer.js');
const BaselineWorkgroupManager = require('./baseline-administrator-lib/managers/baseline-workgroup-manager.js');

const SettingsSaver = require('./utils/SettingsSaver');

const main = async (
  radishOrganisations,
  pathKeystoreResolver,
  pathContractsResolver,
  pathOrganisationResolver,
  organisationMessengerKeyResolver,
  zkpVerificationKeyResolver,
  provider,
  settingsSaver,
) => {
  const { ERC1820Registry, OrgRegistry, Verifier, Shield } = await deployContracts(
    pathKeystoreResolver,
    pathContractsResolver,
    provider,
  );

  const workgroupManager = new BaselineWorkgroupManager(OrgRegistry, Verifier, Shield);

  for (const organisation of radishOrganisations) {
    console.log(`ℹ️   Registering workgroup member: ${organisation}`);
    const organisationConfig = await registerOrganisation(
      workgroupManager,
      pathKeystoreResolver,
      pathOrganisationResolver,
      organisationMessengerKeyResolver,
      organisation,
    );
    await registerOrganisationInterfaceImplementers(
      ERC1820Registry,
      OrgRegistry,
      Shield,
      Verifier,
      pathKeystoreResolver,
      organisation,
    );

    console.log(`ℹ️   Saving settings to config file for: ${organisation}`);
    await saveOrganisationConfig(
      settingsSaver,
      organisation,
      organisationConfig.address,
      organisationConfig.messagingKey,
      organisationConfig.zkpPublicKey,
      organisationConfig.zkpPrivateKey,
      {
        ERC1820Registry: ERC1820Registry.address,
        OrgRegistry: OrgRegistry.address,
        Verifier: Verifier.address,
        Shield: Shield.address,
      },
    );
  }
  await registerRadishInterface(workgroupManager, Shield, Verifier);
  // If it is needed we can set deployer as manager of OrgRegistry in the ERC1820

  console.log(`ℹ️   Registering zkp verification keys`);
  await registerVerificationKey(workgroupManager, zkpVerificationKeyResolver, 'createMSA');
  await registerVerificationKey(workgroupManager, zkpVerificationKeyResolver, 'createPO');

  console.log(`ℹ️   Network information:`);
  await printNetworkInfo(workgroupManager, radishOrganisations, pathKeystoreResolver);

  console.log('----------------- Completed  -----------------');
  console.log(`Please restart the radish-apis for the config to take effect`);
};

const deployContracts = async (pathKeystoreResolver, pathContractsResolver, provider) => {
  const deployerWallet = await pathKeystoreResolver.getWallet('deployer');

  const baselineDeployer = new BaselineDeployer(deployerWallet, provider);

  const protocolBuilder = baselineDeployer.getProtocolBuilder(pathContractsResolver);
  const buildProtocolTask = await protocolBuilder.addErc1820Registry().build();

  const { ERC1820Registry } = await baselineDeployer.deployProtocol(buildProtocolTask);
  console.log('✅  ERC1820Registry deployed:', ERC1820Registry.address);

  const workgroupBuilder = baselineDeployer.getWorkgroupBuilder(pathContractsResolver);
  const buildWorkgroupTask = await workgroupBuilder
    .addOrgRegistry(ERC1820Registry.address)
    .addShield(ERC1820Registry.address)
    .build();

  const { OrgRegistry, Verifier, Shield } = await baselineDeployer.deployWorkgroup(
    buildWorkgroupTask,
  );

  console.log('✅  OrgRegistry deployed:', OrgRegistry.address);
  console.log('✅  Verifier deployed:', Verifier.address);
  console.log('✅  Shield deployed:', Shield.address);

  return {
    ERC1820Registry,
    OrgRegistry,
    Verifier,
    Shield,
  };
};

const registerOrganisation = async (
  workgroupManager,
  pathKeystoreResolver,
  organisationResolver,
  organisationMessengerKeyResolver,
  organisationName,
) => {
  const organisationMessengerURL = process.env[`MESSENGER_${organisationName.toUpperCase()}_URI`]; // Radish specific
  const organisationMessagingKey = await organisationMessengerKeyResolver.resolveMessengerKey(
    organisationMessengerURL,
  );
  const organisationWallet = await pathKeystoreResolver.getWallet(organisationName);
  const organisation = await organisationResolver.resolve(
    organisationName,
    organisationMessagingKey,
  );
  if (typeof organisation.address == 'undefined') {
    organisation.address = organisationWallet.address;
  }

  const transaction = await workgroupManager.registerOrganisation(
    organisation.address,
    organisation.name,
    organisation.role,
    organisation.messagingKey,
    organisation.zkpPublicKey,
  );

  console.log(
    `✅  Registered ${organisationName} in the OrgRegistry with transaction hash: ${transaction.transactionHash}`,
  );

  return organisation;
};

const registerRadishInterface = async (workgroupManager, shieldContract, verifierContract) => {
  const transaction = await workgroupManager.registerOrganisationInterfaces(
    'Radish34',
    ethers.constants.AddressZero,
    shieldContract.address,
    verifierContract.address,
  );

  console.log(
    `✅  Registered the Radish34 interface in the OrgRegistry with transaction hash: ${transaction.transactionHash}`,
  );
};

const registerOrganisationInterfaceImplementers = async (
  erc1820Contract,
  OrgRegistryContract,
  ShieldContract,
  VerifierContract,
  keystoreResolver,
  organisationName,
) => {
  const organisationWallet = await keystoreResolver.getWallet(organisationName);
  const organisationErc1820Instance = await erc1820Contract.connect(organisationWallet);
  const organisationAddress = await organisationWallet.getAddress();
  const orgRegistryTransaction = await organisationErc1820Instance.setInterfaceImplementer(
    organisationAddress,
    ethers.utils.id('IOrgRegistry'),
    OrgRegistryContract.address,
  );
  const orgRegistryReceipt = await orgRegistryTransaction.wait();

  const verifierTransaction = await organisationErc1820Instance.setInterfaceImplementer(
    organisationAddress,
    ethers.utils.id('IVerifier'),
    VerifierContract.address,
  );
  const verifierReceipt = await verifierTransaction.wait();

  const shieldTransaction = await organisationErc1820Instance.setInterfaceImplementer(
    organisationAddress,
    ethers.utils.id('IShield'),
    ShieldContract.address,
  );
  const shieldReceipt = await shieldTransaction.wait();

  console.log(
    `✅  Registered OrgRegistry as IOrgRegistry for ${organisationName} with transaction hash: ${orgRegistryReceipt.transactionHash}`,
  );
  console.log(
    `✅  Registered Verifier as IVerifier for ${organisationName} with transaction hash: ${verifierReceipt.transactionHash}`,
  );
  console.log(
    `✅  Registered Shield as IShield for ${organisationName} with transaction hash: ${shieldReceipt.transactionHash}`,
  );
};

const registerVerificationKey = async (workgroupManager, verificationKeyResolver, circuitName) => {
  const { vkArray, actionType } = await verificationKeyResolver.resolveVerificationKey(circuitName);

  const transaction = await workgroupManager.registerVerificationKey(vkArray, actionType);

  console.log(
    `✅  Registered verification key for ${circuitName} with transaction hash: ${transaction.transactionHash}`,
  );
};

const printNetworkInfo = async (workgroupManager, radishOrganisations, keystoreResolver) => {
  const registeredOrgCount = await workgroupManager.getOrganisationsCount();
  console.log(
    `✅  Radish network of ${registeredOrgCount.toString(
      10,
    )} organizations have successfully been set up!`,
  );
  for (const organisation of radishOrganisations) {
    const organisationWallet = await keystoreResolver.getWallet(organisation);
    const organisationAddress = await organisationWallet.getAddress();
    const organisationInfo = await workgroupManager.getOrganisationInfo(organisationAddress);
    console.log(`✅  Information about ${organisation}: ${organisationInfo}`);
  }
};

const saveOrganisationConfig = async (
  settingsSaver,
  organisationName,
  organisationAddress,
  messagingKey,
  zkpPublicKey,
  zkpPrivateKey,
  addresses,
) => {
  const settings = await settingsSaver.updateSettings(
    organisationName,
    organisationAddress,
    messagingKey,
    zkpPublicKey,
    zkpPrivateKey,
    addresses,
  );
  console.log(`✅  Saved information about ${organisationName}: ${JSON.stringify(settings)}`);
};

// Radish34 Specific organisations. Maybe can be passed from outside?
const radishOrganisations = ['buyer', 'supplier1', 'supplier2'];

const run = async () => {
  assert(typeof process.env.KEYSTORE_PATH === 'string', 'KEYSTORE_PATH not provided or not string');
  assert(
    typeof process.env.ORGANISATION_CONFIG_PATH === 'string',
    'ORGANISATION_CONFIG_PATH not provided or not string',
  );
  assert(typeof process.env.RPC_PROVIDER === 'string', 'RPC_PROVIDER not provided or not string');
  assert(typeof process.env.ZKP_URL === 'string', 'ZKP_URL not provided or not string');

  for (const organisation of radishOrganisations) {
    const messagingURIEnvKey = `MESSENGER_${organisation.toUpperCase()}_URI`;
    assert(
      typeof process.env[messagingURIEnvKey] === 'string',
      `${messagingURIEnvKey} not provided or not string`,
    );
  }

  let keystoreDir = path.resolve(process.env.KEYSTORE_PATH);
  let organisationsConfigDir = path.resolve(process.env.ORGANISATION_CONFIG_PATH);
  let paths = process.env.CONTRACTS_PATH ? path.resolve(process.env.CONTRACTS_PATH) : undefined;

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER);
  const pathKeystoreResolver = new RadishPathKeystoreDirResolver(keystoreDir, provider);
  const pathContractsResolver = new RadishConfigpathContractsResolver(paths);
  const pathOrganisationResolver = new RadishOrganisationConfigpathResolver(organisationsConfigDir);
  const organisationMessengerKeyResolver = new RadishMessengerKeyRestResolver();
  const zkpVerificationKeyResolver = new RadishZKPRestResolver(process.env.ZKP_URL);
  const settingsSaver = new SettingsSaver(organisationsConfigDir, process.env.RPC_PROVIDER);

  await main(
    radishOrganisations,
    pathKeystoreResolver,
    pathContractsResolver,
    pathOrganisationResolver,
    organisationMessengerKeyResolver,
    zkpVerificationKeyResolver,
    provider,
    settingsSaver,
  );
};

run();
