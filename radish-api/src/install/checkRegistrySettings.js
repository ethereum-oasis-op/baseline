import { getServerSettings } from '../utils/serverSettings';

export default async () => {
  const config = await getServerSettings();

  if (config.organizationRegistryAddress) {
    return true;
  }
  return false;
};
