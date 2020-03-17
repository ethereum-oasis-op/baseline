import fs from 'fs';
import { utils } from 'ethers';
import {
  getServerSettings,
  getServerSetting,
  getAddressServerSetting,
} from '../../db/models/baseline/server/settings';
import { getPrivateKey } from '../../wallet';
import {
  getContractWithWallet,
  getContract,
  parseBytes32ToStringArray,
  parseBigNumbersToIntArray,
} from '../../utils/ethers';
import { saveOrganization } from '../../db/models/baseline/organizations';

const OrgRegistryPath = '/app/artifacts/OrgRegistry.json';

export const getOrgRegistryJson = () => {
  if (fs.existsSync(OrgRegistryPath)) {
    const orgRegistry = fs.readFileSync(OrgRegistryPath);
    return JSON.parse(orgRegistry);
  }
  console.log('Unable to locate file: ', OrgRegistryPath);
  throw ReferenceError('Registrar.json not found');
};

export const assignManager = async (fromAddress, toAddress) => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();

  const tx = await getContractWithWallet(
    getOrgRegistryJson(),
    config.addresses.OrgRegistry,
    config.rpcProvider,
    privateKey,
  ).assignManager(fromAddress, toAddress);
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

export const registerToOrgRegistry = async (address, name, role, key) => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();
  const tx = await getContractWithWallet(
    getOrgRegistryJson(),
    config.addresses.OrgRegistry,
    config.rpcProvider,
    privateKey,
  ).registerOrg(
    address,
    utils.formatBytes32String(name),
    role,
    utils.hexlify(messagingKey),
    utils.hexlify(zkpPublicKey),
  );
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

export const getOrganizationCount = async () => {
  const config = await getServerSettings();
  if (!config.addresses.OrgRegistry) {
    return 0;
  }
  const organizationCount = await getContract(
    getOrgRegistryJson(),
    config.rpcProvider,
    config.addresses.OrgRegistry,
  ).getOrgCount();
  return organizationCount.toNumber();
};

export const listOrganizations = async () => {
  const config = await getServerSettings();
  const organizationList = await getContract(
    getOrgRegistryJson(),
    config.rpcProvider,
    config.addresses.OrgRegistry,
  ).getOrgs();
  return {
    addresses: organizationList[0],
    names: parseBytes32ToStringArray(organizationList[1]),
    roles: parseBigNumbersToIntArray(organizationList[2]),
    messagingKeys: organizationList[3],
    zkpPublicKeys: organizationList[4],
  };
};

export const importOrganizationsFromContract = async () => {
  const { rpcProvider } = await getServerSettings();
  if (rpcProvider) {
    const orgCount = await getOrganizationCount();
    const org = await listOrganizations();
    for (let i = 0; i < orgCount; i += 1) {
      const record = {
        _id: org.addresses[i],
        address: org.addresses[i],
        name: org.names[i],
        role: org.roles[i],
        identity: org.messagingKeys[i],
        zkpPublicKey: org.zkpPublicKeys[i],
      };
      await saveOrganization(record);
    }
    console.log(`Imported ${orgCount} organizations from OrgRegisry contract`);
  }
};

export const getRegisteredOrganization = async walletAddress => {
  const rpcProvider = await getServerSetting('rpcProvider');
  const orgRegistryAddress = await getAddressServerSetting('OrgRegistry');
  const organization = await getContract(
    getOrgRegistryJson(),
    rpcProvider,
    orgRegistryAddress,
  ).getOrg(walletAddress);

  return {
    address: organization[0],
    name: utils.parseBytes32String(organization[1]),
    role: organization[2].toNumber(),
    key: organization[3],
  };
};
