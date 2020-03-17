import { utils } from 'ethers';
import { getServerSettings } from '../../db/models/baseline/server/settings';
import { getOrgRegistryJson } from './methods';
import { getContract } from '../../utils/ethers';
import { saveOrganization } from '../../db/models/baseline/organizations';

export const subscribeRegisterOrgEvent = async () => {
  const config = await getServerSettings();
  const orgRegistryJson = getOrgRegistryJson();
  if (!config.organizationRegistryAddress) {
    return;
  }
  const orgRegistryContract = getContract(
    orgRegistryJson,
    config.rpcProvider,
    config.organizationRegistryAddress,
  );
  orgRegistryContract.on('RegisterOrg', async (name, address, role, key) => {
    await saveOrganization({
      name: utils.parseBytes32String(name),
      address: address,
      role: role.toNumber(),
      identity: key,
    });
  });
};

export default {
  subscribeRegisterOrgEvent,
};
