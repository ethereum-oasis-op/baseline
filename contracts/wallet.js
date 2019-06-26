import ProviderEngine from 'web3-provider-engine';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import { SolCompilerArtifactAdapter, RevertTraceSubprovider } from '@0x/sol-trace';
import { ProfilerSubprovider } from '@0x/sol-profiler';
import { CoverageSubprovider } from '@0x/sol-coverage';
import { ethers } from 'ethers';

let walletWithProvider;

const getWallet = () => {
  if (walletWithProvider) return walletWithProvider;

  const engine = new ProviderEngine();
  const wallet = new ethers.Wallet('0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3');
  const artifactAdapter = new SolCompilerArtifactAdapter();

  const revertTraceSubprovider = new RevertTraceSubprovider(artifactAdapter, wallet.address, true);
  // const profilerSubprovider = new ProfilerSubprovider(artifactAdapter, wallet.address);
  // const coverageSubprovider = new CoverageSubprovider(artifactAdapter, wallet.address);
  const rpcProvider = new RpcSubprovider({ rpcUrl: 'http://ganache:8545' });

  engine.addProvider(revertTraceSubprovider);
  // engine.addProvider(profilerSubprovider);
  // engine.addProvider(coverageSubprovider);
  engine.addProvider(rpcProvider);
  engine.start();

  const provider = new ethers.providers.Web3Provider(engine);
  walletWithProvider = wallet.connect(provider);

  return walletWithProvider;
};

export default getWallet;
