import { getServerSettings } from '../utils/serverSettings';
import { logger } from 'radish34-logger';

export default async () => {
  const config = await getServerSettings();

  if (config.rpcProvider) {
    logger.info(`Loading network ${config.rpcProvider}...`, { service: 'API' });
    return true;
  }
  return false;
};
