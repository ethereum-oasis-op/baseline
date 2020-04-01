import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import { SolCompilerArtifactAdapter } from '@0x/sol-trace';
import { ProfilerSubprovider } from '@0x/sol-profiler';
import { CoverageSubprovider } from '@0x/sol-coverage';
import * as path from 'path';
import { ethers, utils } from 'ethers';
import { Web3ProviderEngine, FakeGasEstimateSubprovider } from "@0x/subproviders";
import { providerUtils } from '@0x/utils';

let walletWithProvider;

ethers.errors.setLogLevel('error');

const wallet = new ethers.Wallet('0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3');
const artifactAdapter = new SolCompilerArtifactAdapter(path.resolve(__dirname, '../artifacts'), path.resolve(__dirname, '../contracts'));
const profilerSubprovider = new ProfilerSubprovider(artifactAdapter, wallet.address);
const coverageSubprovider = new CoverageSubprovider(artifactAdapter, wallet.address);

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(new FakeGasEstimateSubprovider(4 * (10 ** 6)));
providerEngine.addProvider(new RpcSubprovider({ rpcUrl: 'http://0.0.0.0:8545' }));
providerEngine.addProvider(profilerSubprovider);
providerEngine.addProvider(coverageSubprovider);
providerUtils.startProviderEngine(providerEngine);
const rpcProvider = new ethers.providers.Web3Provider(providerEngine);
walletWithProvider = wallet.connect(rpcProvider);

export const getWallet = () => {
  return walletWithProvider;
}

export const getAccounts = async () => {
  return await rpcProvider.listAccounts();
}

export const getSigner = async (i) => {
  return await rpcProvider.getSigner(i);
}

export const getProvider = () => {
  return rpcProvider;
}

//Note: The below method is brought in from api/src/utils/ethers.js

export const link = (bytecode, libraryName, libraryAddress) => {
  const address = libraryAddress.replace('0x', '');
  const { linkReferences } = bytecode;
  let qualifyingLibraryName;

  // We parse the bytecode's linkedReferences in search of the correct path of the library (in order to construct a correctly formatted qualifyingLibraryName)
  // eslint-disable-next-line no-restricted-syntax
  for (const entry of Object.entries(linkReferences)) {
    if (libraryName in entry[1]) {
      // From Solidity docs: Note that the fully qualified library name is the path of its source file and the library name separated by :.
      qualifyingLibraryName = `${entry[0]}:${libraryName}`;
      break;
    }
  }
  if (qualifyingLibraryName === undefined)
    throw new Error(`linkReference for library '${libraryName}' not found in contract's bytecode.`);

  const encodedLibraryName = utils
    .solidityKeccak256(['string'], [qualifyingLibraryName])
    .slice(2, 36);
  // console.log(`\nEncoded library name for ${qualifyingLibraryName}: ${encodedLibraryName}`);

  const pattern = new RegExp(`_+\\$${encodedLibraryName}\\$_+`, 'g');
  // ensure this particular library is being used by the contract (by checking for its encoded name within the contract's bytecode)
  if (!pattern.exec(bytecode.object)) {
    throw new Error(
      `Can't find the encoding ${encodedLibraryName} of ${libraryName}'s qualifying library name ${qualifyingLibraryName} in the contract's bytecode. It's possible that the library's path (i.e. the preimage of the keccak encoding) is incorrect.`,
    );
  }

  // swap out the placeholder with the library's deployed address:
  return bytecode.object.replace(pattern, address);
};
