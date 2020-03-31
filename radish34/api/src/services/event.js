import { utils } from 'ethers';
import { getServerSettings } from '../utils/serverSettings';
import { getContract } from '../utils/ethers';
import { saveOrganization } from './organization';
import { getContractJson } from './contract';

export const subscribeRegisterOrgEvent = async () => {
  const config = await getServerSettings();
  const { rpcProvider } = config;
  const { OrgRegistry } = config.addresses;
  const orgRegistryJson = getContractJson('OrgRegistry');
  if (!OrgRegistry) {
    return;
  }
  const orgRegistryContract = getContract(
    orgRegistryJson,
    rpcProvider,
    OrgRegistry,
  );
  orgRegistryContract.on('RegisterOrg', (name, address, role, messagingKey, zkpPublicKey) => {
    saveOrganization({
      name: utils.parseBytes32String(name),
      address,
      role: role.toNumber(),
      identity: messagingKey,
      zkpPublicKey,
    });
  });
};

export default {
  subscribeRegisterOrgEvent,
};
