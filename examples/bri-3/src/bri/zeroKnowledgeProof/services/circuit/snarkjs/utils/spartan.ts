import * as snarkjs from 'snarkjs';
import { fromRpcSig } from '@ethereumjs/util';
import * as fs from 'fs';

export const calculateCircuitWitness = async (input: any, wasmFile: string) => {
  const witness: {
    type: string;
    data?: any;
  } = {
    type: 'mem',
  };

  await snarkjs.wtns.calculate(input, wasmFile, witness);
  return witness;
};

/**
 * Load a circuit from a file or URL
 */
export const loadCircuit = async (pathOrUrl: string): Promise<Uint8Array> => {
  const isWeb = typeof window !== 'undefined';
  if (isWeb) {
    return await fetchCircuit(pathOrUrl);
  } else {
    return await readCircuitFromFs(pathOrUrl);
  }
};

const readCircuitFromFs = async (path: string): Promise<Uint8Array> => {
  const bytes = fs.readFileSync(path);
  return new Uint8Array(bytes);
};

const fetchCircuit = async (url: string): Promise<Uint8Array> => {
  const response = await fetch(url);

  const circuit = await response.arrayBuffer();

  return new Uint8Array(circuit);
};

export const bytesToBigInt = (bytes: Uint8Array): bigint =>
  BigInt('0x' + Buffer.from(bytes).toString('hex'));

export const bytesLeToBigInt = (bytes: Uint8Array): bigint => {
  const reversed = bytes.reverse();
  return bytesToBigInt(reversed);
};

export const bigIntToBytes = (n: bigint, size: number): Uint8Array => {
  const hex = n.toString(16);
  const hexPadded = hex.padStart(size * 2, '0');
  return Buffer.from(hexPadded, 'hex');
};

export const bigIntToLeBytes = (n: bigint, size: number): Uint8Array => {
  const bytes = bigIntToBytes(n, size);
  return bytes.reverse();
};

export const serialize = (inputs: bigint[]): Uint8Array => {
  const serialized = new Uint8Array(32 * inputs.length);
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const bytes = bigIntToLeBytes(input, 32);
    serialized.set(bytes, i * 32);
  }
  return serialized;
};

export const deserialize = (serialized: Uint8Array): bigint[] => {
  const inputs: bigint[] = [];
  for (let i = 0; i < serialized.length; i += 32) {
    const bytes = serialized.slice(i, i + 32);
    const input = bytesLeToBigInt(bytes);
    inputs.push(input);
  }
  return inputs;
};
