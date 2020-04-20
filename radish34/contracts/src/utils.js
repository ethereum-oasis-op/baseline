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
// Note: Below line can be activated to get an estimate of the gas consumption if a real network were to be used for contract management
// providerEngine.addProvider(new FakeGasEstimateSubprovider(4 * (10 ** 6)));
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

// TODO: Remove the following functions from this file. They are duplicates 
// from /api/src/utils/crypto/conversions.js. Ideally these would be part of an importable
// utils package that can be used by multiple services.
// flattenDeep, parseToDigitsArray, add, multiplyByNumber, convertBase, hexToDec, formatProof
export const flattenDeep = arr => {
  return arr.reduce(
    (acc, val) => (Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val)),
    [],
  );
};

/** Helper function for the converting any base to any base
 */
export const parseToDigitsArray = (str, base) => {
  const digits = str.split('');
  const ary = [];
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    const n = parseInt(digits[i], base);
    if (Number.isNaN(n)) return null;
    ary.push(n);
  }
  return ary;
};

/** Helper function for the converting any base to any base
 */
export const add = (x, y, base) => {
  const z = [];
  const n = Math.max(x.length, y.length);
  let carry = 0;
  let i = 0;
  while (i < n || carry) {
    const xi = i < x.length ? x[i] : 0;
    const yi = i < y.length ? y[i] : 0;
    const zi = carry + xi + yi;
    z.push(zi % base);
    carry = Math.floor(zi / base);
    i += 1;
  }
  return z;
};

/** Helper function for the converting any base to any base
 Returns a*x, where x is an array of decimal digits and a is an ordinary
 JavaScript number. base is the number base of the array x.
 */
export const multiplyByNumber = (num, x, base) => {
  if (num < 0) return null;
  if (num === 0) return [];

  let result = [];
  let power = x;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-bitwise
    if (num & 1) {
      result = add(result, power, base);
    }
    num >>= 1; // eslint-disable-line
    if (num === 0) break;
    power = add(power, power, base);
  }
  return result;
};

/** Helper function for the converting any base to any base
 */
export const convertBase = (str, fromBase, toBase) => {
  const digits = parseToDigitsArray(str, fromBase);
  if (digits === null) return null;

  let outArray = [];
  let power = [1];
  for (let i = 0; i < digits.length; i += 1) {
    // invariant: at this point, fromBase^i = power
    if (digits[i]) {
      outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
    }
    power = multiplyByNumber(fromBase, power, toBase);
  }

  let out = '';
  for (let i = outArray.length - 1; i >= 0; i -= 1) {
    out += outArray[i].toString(toBase);
  }
  // if the original input was equivalent to zero, then 'out' will still be empty ''. Let's check for zero.
  if (out === '') {
    let sum = 0;
    for (let i = 0; i < digits.length; i += 1) {
      sum += digits[i];
    }
    if (sum === 0) out = '0';
  }

  return out;
};

// Converts hex strings to decimal values
export const hexToDec = hexStr => {
  if (hexStr.substring(0, 2) === '0x') {
    return convertBase(hexStr.substring(2).toLowerCase(), 16, 10);
  }
  return convertBase(hexStr.toLowerCase(), 16, 10);
};

export const formatProof = proofObject => {
  let proof = Object.values(proofObject);
  // convert to flattened array:
  // proof = flattenDeep(proof);
  // convert to decimal, as the solidity functions expect a proof to be am array of uints
  proof = proof.map(el => hexToDec(el));
  return proof;
};
