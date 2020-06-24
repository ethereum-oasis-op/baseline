import { setServerState, getServerState } from '../utils/serverState';
import checkNetworkSettings from './checkNetworkSettings';
import checkRegistrySettings from './checkRegistrySettings';
import checkIsRegistered from './checkIsRegistered';
import checkConnectedToRPC from './checkConnectedToRPC';
import checkMessenger from './checkMessenger';
import checkWallet from './checkWallet';
import checkWalletBalance from './checkWalletBalance';

export default async () => {
  let state;

  if ((await checkNetworkSettings()) === false) {
    console.log('Checking Network Settings failed ...');
    state = 'nonetwork';
  } else if ((await checkConnectedToRPC()) === false) {
    console.log('Checking Connection To RPC Server failed ...');
    state = 'notconnected';
  } else if ((await checkMessenger()) === false) {
    console.log('Checking Messenger Service Connection To Geth Client ...');
    state = 'nomessenger';
  } else if ((await checkWallet()) === false) {
    console.log('Organization wallet not found');
    state = 'nowallet';
  } else if ((await checkWalletBalance()) === false) {
    console.log('Organization account has inadequite funds');
    state = 'nobalance';
  } else if ((await checkRegistrySettings()) === false) {
    console.log('Checking Registry Settings failed ...');
    state = 'noregistry';
  } else if ((await checkIsRegistered()) === false) {
    console.log('Checking If Registered failed...');
    state = 'isregistered';
  } else {
    console.log('All systems go.');
    state = 'ready';
  }

  await setServerState(state);
  const serverState = await getServerState();
  console.log('🏥  Healthcheck Status:', serverState);
};
