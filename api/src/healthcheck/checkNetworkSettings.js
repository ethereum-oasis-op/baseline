import { getServerSettings } from '../db/models/baseline/server/settings';

export default async () => {
  const config = await getServerSettings();

  if (config.rpcProvider) {
    console.log(`Loading network ${config.rpcProvider}...`);
    return true;
  }
  return false;
};
