/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
const path = require('path');
const assert = require('assert');
const ethers = require('ethers');
const { logger } = require('radish34-logger');

const RadishConfigpathContractsResolver = require('./baseline-administrator-lib/resolvers/contract-resolvers/radish-configpath-resolver.js');
const RadishPathKeystoreDirResolver = require('./baseline-administrator-lib/resolvers/keystore-resolvers/radish-keystore-dir-resolver.js');
const RadishOrganisationConfigpathResolver = require('./baseline-administrator-lib/resolvers/organisation-resolvers/radish-configpath-resolver.js');
const RadishMessagingEndpointResolver = require('./baseline-administrator-lib/resolvers/organisation-resolvers/radish-messaging-endpoint-resolver.js');
const RadishMessagingKeyRestResolver = require('./baseline-administrator-lib/resolvers/organisation-resolvers/radish-messenger-key-rest-resolver.js');
const RadishZKPRestResolver = require('./baseline-administrator-lib/resolvers/verification-key-resolvers/radish-zkp-rest-resolver');

const BaselineDeployer = require('./baseline-administrator-lib/deployers/baseline-deployer.js');
const BaselineWorkgroupManager = require('./baseline-administrator-lib/managers/baseline-workgroup-manager.js');

const SettingsSaver = require('./utils/SettingsSaver');

const main = async (
  radishOrganisations,
  pathKeystoreResolver,
  pathContractsResolver,
  pathOrganisationResolver,
  organisationMessagingEndpointResolver,
  organisationMessagingKeyResolver,
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
    logger.info(`Registering workgroup member: ${organisation}.`, { service: 'DEPLOY'});
    const organisationConfig = await registerOrganisation(
      workgroupManager,
      pathKeystoreResolver,
      pathOrganisationResolver,
      organisationMessagingEndpointResolver,
      organisationMessagingKeyResolver,
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

    logger.info(`Saving settings to config file for: ${organisation}.`, { service: 'DEPLOY'});
    await saveOrganisationConfig(
      settingsSaver,
      organisation,
      organisationConfig.address,
      organisationConfig.messagingEndpoint,
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

  logger.info('Registering zkp verification keys.', { service: 'DEPLOY'});
  const zkpMode = process.env.ZKP_MODE || 0; // Default to createMSA/createPO
  if (zkpMode == 0) {
    await registerVerificationKey(workgroupManager, zkpVerificationKeyResolver, 'createMSA', 0);
    await registerVerificationKey(workgroupManager, zkpVerificationKeyResolver, 'createPO', 0);
  } else if (zkpMode == 1) {
    await registerVerificationKey(workgroupManager, zkpVerificationKeyResolver, 'createDummyMSA', 1);
    await registerVerificationKey(workgroupManager, zkpVerificationKeyResolver, 'createDummyPO', 1);
  }

  logger.info('Network information:', { service: 'DEPLOY'});
  await printNetworkInfo(workgroupManager, radishOrganisations, pathKeystoreResolver);

  logger.info('----------------- Deployment completed  -----------------', { service: 'DEPLOY'});
  logger.info('Please restart the radish-apis for the config to take effect.', { service: 'DEPLOY'});
};

const deployContracts = async (pathKeystoreResolver, pathContractsResolver, provider) => {
  const deployerWallet = await pathKeystoreResolver.getWallet('deployer');

  const baselineDeployer = new BaselineDeployer(deployerWallet, provider);

  const protocolBuilder = baselineDeployer.getProtocolBuilder(pathContractsResolver);
  const buildProtocolTask = await protocolBuilder.addErc1820Registry().build();

  const { ERC1820Registry } = await baselineDeployer.deployProtocol(buildProtocolTask);
  logger.info(`ERC1820Registry deployed: ${ERC1820Registry.address}.`, { service: 'DEPLOY'});

  const workgroupBuilder = baselineDeployer.getWorkgroupBuilder(pathContractsResolver);
  const buildWorkgroupTask = await workgroupBuilder
    .addOrgRegistry(ERC1820Registry.address)
    .addShield(ERC1820Registry.address)
    .build();

  const { OrgRegistry, Verifier, Shield } = await baselineDeployer.deployWorkgroup(
    buildWorkgroupTask,
  );

  logger.info(`OrgRegistry deployed: ${OrgRegistry.address}.`, { service: 'DEPLOY'});
  logger.info(`Verifier deployed: ${Verifier.address}.`, { service: 'DEPLOY'});
  logger.info(`Shield deployed: ${Shield.address}.`, { service: 'DEPLOY'});

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
  organisationMessagingEndpointResolver,
  organisationMessagingKeyResolver,
  organisationName,
) => {
  let organisationMessagingEndpoint;
  let organisationMessagingKey;
  organisationMessagingEndpoint = await organisationMessagingEndpointResolver.resolve(
    organisationName,
  );
  if (!organisationMessagingEndpoint) {
    organisationMessagingEndpoint = process.env[`MESSENGER_${organisationName.toUpperCase()}_URI`]; // Radish specific
    organisationMessagingKey = await organisationMessagingKeyResolver.resolveMessagingKey(
      organisationMessagingEndpoint,
    );
  }

  const organisationWallet = await pathKeystoreResolver.getWallet(organisationName);
  const organisation = await organisationResolver.resolve(
    organisationName,
    organisationMessagingEndpoint,
    organisationMessagingKey
  );
  if (typeof organisation.address === 'undefined') {
    organisation.address = organisationWallet.address;
  }

  const transaction = await workgroupManager.registerOrganisation(
    organisation.address,
    organisation.name,
    organisation.messagingEndpoint,
    organisation.messagingKey,
    organisation.zkpPublicKey,
    '{}', // Freeform metadata, i.e., for storing an organization's Azure subscription id
  );

  logger.info(`Registered ${organisationName} in the OrgRegistry with transaction hash: ${transaction.transactionHash}.`, { service: 'DEPLOY'});

  return organisation;
};

const registerRadishInterface = async (workgroupManager, shieldContract, verifierContract) => {
  const transaction = await workgroupManager.registerOrganisationInterfaces(
    'Radish34',
    ethers.constants.AddressZero,
    shieldContract.address,
    verifierContract.address,
  );

  logger.info(`Registered the Radish34 interface in the OrgRegistry with transaction hash: ${transaction.transactionHash}.`, { service: 'DEPLOY'});
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


  logger.info(`Registered OrgRegistry as IOrgRegistry for ${organisationName} with transaction hash: ${orgRegistryReceipt.transactionHash}.`, { service: 'DEPLOY'});
  logger.info(`Registered Verifier as IVerifier for ${organisationName} with transaction hash: ${verifierReceipt.transactionHash}.`, { service: 'DEPLOY'});
  logger.info(`Registered Shield as IShield for ${organisationName} with transaction hash: ${shieldReceipt.transactionHash}.`, { service: 'DEPLOY'});
};

const registerVerificationKey = async (
  workgroupManager,
  verificationKeyResolver,
  circuitName,
  mode,
) => {
  const { vkArray, actionType } = await verificationKeyResolver.resolveVerificationKey(
    circuitName,
    mode,
  );

  const transaction = await workgroupManager.registerVerificationKey(vkArray, actionType);

  logger.info(`Registered verification key for ${circuitName} with transaction hash: ${transaction.transactionHash}.`, { service: 'DEPLOY'});
};

const printNetworkInfo = async (workgroupManager, radishOrganisations, keystoreResolver) => {
  const registeredOrgCount = await workgroupManager.getOrganisationsCount();
  logger.info(`Radish network of ${registeredOrgCount.toString(
    10,
  )} organizations have successfully been set up!`, { service: 'DEPLOY'});
  for (const organisation of radishOrganisations) {
    const organisationWallet = await keystoreResolver.getWallet(organisation);
    const organisationAddress = await organisationWallet.getAddress();
    const organisationInfo = await workgroupManager.getOrganisationInfo(organisationAddress);
    logger.info(`Information about ${organisation}: ${organisationInfo.toString()}`, { service: 'DEPLOY'});
  }
};

const saveOrganisationConfig = async (
  settingsSaver,
  organisationName,
  organisationAddress,
  messagingEndpoint,
  messagingKey,
  zkpPublicKey,
  zkpPrivateKey,
  addresses,
) => {
  const settings = await settingsSaver.updateSettings(
    organisationName,
    organisationAddress,
    messagingEndpoint,
    messagingKey,
    zkpPublicKey,
    zkpPrivateKey,
    addresses,
  );
  logger.info(`Saved information about ${organisationName}:\n%o.`, settings, { service: 'DEPLOY'});
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

  const keystoreDir = path.resolve(process.env.KEYSTORE_PATH);
  const organisationsConfigDir = path.resolve(process.env.ORGANISATION_CONFIG_PATH);
  const paths = process.env.CONTRACTS_PATH ? path.resolve(process.env.CONTRACTS_PATH) : undefined;

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER);
  const pathKeystoreResolver = new RadishPathKeystoreDirResolver(keystoreDir, provider);
  const pathContractsResolver = new RadishConfigpathContractsResolver(paths);
  const pathOrganisationResolver = new RadishOrganisationConfigpathResolver(organisationsConfigDir);
  const organisationMessengingEndpointResolver = new RadishMessagingEndpointResolver(
    organisationsConfigDir,
  );
  const organisationMessagingKeyResolver = new RadishMessagingKeyRestResolver();
  const zkpVerificationKeyResolver = new RadishZKPRestResolver(process.env.ZKP_URL);
  const settingsSaver = new SettingsSaver(organisationsConfigDir, process.env.RPC_PROVIDER);

  await main(
    radishOrganisations,
    pathKeystoreResolver,
    pathContractsResolver,
    pathOrganisationResolver,
    organisationMessengingEndpointResolver,
    organisationMessagingKeyResolver,
    zkpVerificationKeyResolver,
    provider,
    settingsSaver,
  );
};

run();
