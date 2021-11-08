import { getServerSettings } from '../utils/serverSettings';
import { getProvider, getDefaultProvider } from '../utils/ethers';
import { logger } from 'radish34-logger';

const providers = ['homestead', 'rinkeby', 'ropsten', 'kovan', 'goerli'];

export default async () => {
  const config = await getServerSettings();
  let connection;

  if (providers.includes(config.rpcProvider)) {
    connection = await getDefaultProvider(config.rpcProvider);
  } else {
    connection = await getProvider(config.rpcProvider);
  }

  connection
    .getNetwork()
    .then(network => {
      logger.info(`Connected to network: %o`, network, { service: 'API' });
    })
    .catch(err => {
      logger.error(`Could not connect to RPC server at ${config.rpcProvider}.\n%o`, err, { service: 'API' });
      return false;
    });

  return true;
};
