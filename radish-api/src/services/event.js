import { utils } from 'ethers';
import fs from 'fs';
import { getServerSettings } from '../utils/serverSettings';
import { getContract } from '../utils/ethers';
import { saveOrganization } from './organization';

const OrgRegistryPath = '/app/artifacts/OrgRegistry.json';

export const getOrgRegistryJson = () => {
  if (fs.existsSync(OrgRegistryPath)) {
    const orgRegistry = fs.readFileSync(OrgRegistryPath);
    return JSON.parse(orgRegistry);
  }
  console.log('Unable to locate file: ', OrgRegistryPath);
  throw ReferenceError('Registrar.json not found');
};

export const subscribeRegisterOrgEvent = async () => {
  const config = await getServerSettings();
  const orgRegistryJson = getOrgRegistryJson();
  const orgRegistryContract = getContract(
    orgRegistryJson,
    config.rpcProvider,
    config.organizationRegistryAddress,
  );
  orgRegistryContract.on('RegisterOrg', (name, address, role) => {
    saveOrganization({
      name: utils.parseBytes32String(name),
      address: address,
      role: role.toNumber(),
    });
  });
};

export default {
  subscribeRegisterOrgEvent,
};
