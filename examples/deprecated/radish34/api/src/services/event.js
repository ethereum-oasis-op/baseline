import { utils } from 'ethers';
import { getServerSettings } from '../utils/serverSettings';
import { getContract } from '../utils/ethers';
import { saveOrganization } from './organization';
import { getContractJson } from './contract';

export const subscribeRegisterOrgEvent = async () => {
  const config = await getServerSettings();
  const orgRegistryJson = getContractJson('OrgRegistry');
  if (!config.addresses.OrgRegistry) {
    return;
  }
  const orgRegistryContract = getContract(
    orgRegistryJson,
    config.rpcProvider,
    config.addresses.OrgRegistry,
  );
  orgRegistryContract.on('RegisterOrg', (name, address, role, messagingKey, zkpPublicKey) => {
    saveOrganization({
      name: utils.parseBytes32String(name),
      address: address,
      role: role.toNumber(),
      identity: messagingKey,
      zkpPublicKey: zkpPublicKey,
    });
  });
};

export default {
  subscribeRegisterOrgEvent,
};
