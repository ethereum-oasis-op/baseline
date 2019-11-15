import { getServerSettings } from '../utils/serverSettings';

const connect = async () => {
  const isConnected = await true;
  return isConnected;
};

// TODO: Do a legitimate call/connect to the RPC server before moving on
export default async () => {
  const config = await getServerSettings();

  if (config.networkId) {
    const isConnected = await connect();
    if (isConnected) {
      console.log('Connected to RPC');
      return true;
    }
    console.log('Not connected to RPC');
    return false;
  }
  return false;
};
