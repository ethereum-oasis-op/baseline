import { getServerSettings } from '../utils/serverSettings';
import { getProvider, getDefaultProvider } from '../utils/ethers';

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
      console.log('Connected to network:', network);
    })
    .catch(err => {
      console.error(`Could not connect to RPC server at '${config.rpcProvider}'`, err);
      return false;
    });

  return true;
};
