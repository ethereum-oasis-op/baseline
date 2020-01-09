import { getServerSettings } from '../utils/serverSettings';

export default async () => {
  const config = await getServerSettings();

  console.log('CONFIG SETTINGS', config);
  process.env.MESSENGER_ID = config.organizationWhisperKey;

  // 1.) Checks to see if there is a config for the networkId AND rpcURL
  // 2.) Attempts to connect to the server

  if (config.networkId) {
    console.log(`Loading network ${config.networkId}...`);
    return true;
  }
  return false;
};
