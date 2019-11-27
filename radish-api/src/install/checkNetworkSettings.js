import { getServerSettings } from '../utils/serverSettings';

export default async () => {
  const config = await getServerSettings();

  if (config.networkId) {
    console.log(`Loading network ${config.networkId}...`);
    return true;
  }
  return false;
};
