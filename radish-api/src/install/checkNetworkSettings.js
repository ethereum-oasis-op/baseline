import { getServerSettings } from '../utils/serverSettings';
export default async () => {
  const config = await getServerSettings();

  if (config.rpcProvider) {
    console.log(`Loading network ${config.rpcProvider}...`);
    return true;
  }
  return false;
};
