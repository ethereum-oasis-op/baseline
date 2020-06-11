import { setServerState, getServerState } from '../utils/serverState';
import checkNetworkSettings from './checkNetworkSettings';
import checkRegistrySettings from './checkRegistrySettings';
import checkIsRegistered from './checkIsRegistered';
import checkConnectedToRPC from './checkConnectedToRPC';
import checkMessenger from './checkMessenger';
import checkWallet from './checkWallet';
import checkWalletBalance from './checkWalletBalance';
import { logger } from 'radish34-logger';

export default async () => {
  let state;

  if ((await checkNetworkSettings()) === false) {
    logger.warning('Checking network settings failed.', { service: 'API' });
    state = 'nonetwork';
  } else if ((await checkConnectedToRPC()) === false) {
    logger.warning('Checking connection to RPC server failed.', { service: 'API' });
    state = 'notconnected';
  } else if ((await checkMessenger()) === false) {
    logger.warning('Checking messenger service connection to geth client.', { service: 'API' });
    state = 'nomessenger';
  } else if ((await checkWallet()) === false) {
    logger.warning('Organization wallet not found.', { service: 'API' });
    state = 'nowallet';
  } else if ((await checkWalletBalance()) === false) {
    logger.warning('Organization account has inadequite funds.', { service: 'API' });
    state = 'nobalance';
  } else if ((await checkRegistrySettings()) === false) {
    logger.warning('Checking registry settings failed.', { service: 'API' });
    state = 'noregistry';
  } else if ((await checkIsRegistered()) === false) {
    logger.warning('Checking if registered failed.', { service: 'API' });
    state = 'isregistered';
  } else {
    logger.info('All systems go.', { service: 'API' });
    state = 'ready';
  }

  await setServerState(state);
  const serverState = await getServerState();
  logger.info(`Healthcheck Status: ${serverState}.`, { service: 'API' });
};
