import { setServerState, getServerState } from '../utils/serverState';
import checkNetworkSettings from './checkNetworkSettings';
import checkRegistrySettings from './checkRegistrySettings';
import checkIsDeploying from './checkIsDeploying';
import checkIsRegistered from './checkIsRegistered';
import checkIsRegistering from './checkIsRegistering';
import checkAdminAccount from './checkAdminAccount';
import checkConnectedToRPC from './checkConnectedToRPC';

export default async () => {
  let state;

  if ((await checkNetworkSettings()) === false) {
    console.log('Checking Network Settings ...');
    state = 'nonetwork';
  } else if ((await checkConnectedToRPC()) === false) {
    console.log('Checking Connection To RPC Server ...');
    state = 'notconnected';
  } else if ((await checkRegistrySettings()) === false) {
    console.log('Checking Registry Settings ...');
    state = 'noregistry';
  } else if (await checkIsDeploying()) {
    console.log('Checking If Deploying ...');
    state = 'deploying';
  } else if ((await checkIsRegistered()) === false) {
    console.log('Checking If Registered ...');
    state = 'isregistered';
  } else if (await checkIsRegistering()) {
    console.log('Checking If Regestering ...');
    state = 'isregistering';
  } else if ((await checkAdminAccount()) === false) {
    console.log('Checking Admin Account ...');
    state = 'noadmin';
  } else {
    console.log('All systems go.');
    state = 'ready';
  }

  await setServerState(state);
  const serverState = await getServerState();
  console.log('🏥  Healthcheck Status:', serverState);
};
