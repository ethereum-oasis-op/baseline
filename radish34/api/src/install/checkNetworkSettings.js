import { getServerSettings } from '../utils/serverSettings';

export default async () => {
  const config = await getServerSettings();
  const { rpcProvider } = config;

  if (rpcProvider) {
    console.log(`Loading network ${rpcProvider}...`);
    return true;
  }
  return false;
};
