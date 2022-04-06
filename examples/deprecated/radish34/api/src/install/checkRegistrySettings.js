import { getServerSettings } from '../utils/serverSettings';

export default async () => {
  const config = await getServerSettings();

  if (config.addresses.OrgRegistry && config.organization.zkpPublicKey) {
    return true;
  }
  return false;
};
