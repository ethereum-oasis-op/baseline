import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import { SolCompilerArtifactAdapter, RevertTraceSubprovider } from '@0x/sol-trace';
import { ProfilerSubprovider } from '@0x/sol-profiler';
import { CoverageSubprovider } from '@0x/sol-coverage';
import * as path from 'path';
import { ethers } from 'ethers';
import { Web3ProviderEngine, FakeGasEstimateSubprovider } from "@0x/subproviders";
import { providerUtils } from '@0x/utils';

let walletWithProvider;

ethers.errors.setLogLevel('error');

const wallet = new ethers.Wallet('0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3');
const artifactAdapter = new SolCompilerArtifactAdapter(path.resolve(__dirname, 'artifacts'), path.resolve(__dirname, 'contracts'));

const revertTraceSubprovider = new RevertTraceSubprovider(artifactAdapter, wallet.address, true);
const profilerSubprovider = new ProfilerSubprovider(artifactAdapter, wallet.address);
const coverageSubprovider = new CoverageSubprovider(artifactAdapter, wallet.address);

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(new FakeGasEstimateSubprovider(4 * (10 ** 6))); 
// Ganache does a poor job of estimating gas, so just crank it up for testing.
providerEngine.addProvider(revertTraceSubprovider);
providerEngine.addProvider(new RpcSubprovider({ rpcUrl: 'http://ganache:8545' }));
providerEngine.addProvider(profilerSubprovider);
providerEngine.addProvider(coverageSubprovider);
providerUtils.startProviderEngine(providerEngine);
const rpcProvider = new ethers.providers.Web3Provider(providerEngine);
walletWithProvider = wallet.connect(rpcProvider);
// ALTERNATELY BELOW CAN BE USED AS WELL
// --->> const rpcProvider = new ethers.providers.JsonRpcProvider('http://ganache:8545');
// --->> console.log(rpcProvider);
// --->> walletWithProvider = wallet.connect(rpcProvider);
// --->> rpcProvider.listAccounts().then((accounts) => { console.log(accounts); });
// --->> const w = rpcProvider.getSigner(0);
// --->> console.log(w.getAddress().then(a => {console.log(a)}));

export const getWallet = () => {
  return walletWithProvider;
}

export const getAccounts = async () => {
  return await rpcProvider.listAccounts();
}

export const getSigner = async (i) => {
  return await rpcProvider.getSigner(i);
}
