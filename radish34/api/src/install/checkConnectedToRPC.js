import { getServerSettings } from '../utils/serverSettings';
import { getProvider, getDefaultProvider } from '../utils/ethers';

const providers = ['homestead', 'rinkeby', 'ropsten', 'kovan', 'goerli'];

export default async () => {
  const config = await getServerSettings();
  let connection;
  const { rpcProvider } = config;

  if (providers.includes(rpcProvider)) {
    connection = await getDefaultProvider(rpcProvider);
  } else {
    connection = await getProvider(rpcProvider);
  }

  connection
    .getNetwork()
    .then(network => {
      console.log('Connected to network:', network);
    })
    .catch(err => {
      console.error(`Could not connect to RPC server at '${rpcProvider}'`, err);
      return false;
    });

  return true;
};
