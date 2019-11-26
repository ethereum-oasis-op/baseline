import { getServerSettings } from '../utils/serverSettings';
import { getProvider, getDefaultProvider } from '../utils/ethers';

const providers = ['homestead', 'rinkeby', 'ropsten', 'kovan', 'goerli'];

export default async () => {
  const config = await getServerSettings();
  let connection;

  if (providers.includes(config.networkId)) {
    connection = await getDefaultProvider(config.networkId);
  } else {
    connection = await getProvider(config.networkId);
  }

  connection.getNetwork().then(network => {
    console.log('Connected to network:', network);
  });

  connection.getBlockNumber().then(blockNumber => {
    console.log('Current block:', blockNumber);
  });

  return false;
};
