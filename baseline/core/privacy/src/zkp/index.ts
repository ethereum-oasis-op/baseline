import { initialize, ZoKratesProvider } from 'zokrates-js';

export interface ZKSnarkCircuitProvider {
  compile(source: string, location: string): Promise<any>;
  computeWitness(artifacts: any, args: any[]): Promise<any>;
  exportVerifier(verifyingKey): Promise<string>;
  generateProof(circuit, witness, provingKey): Promise<string>;
  setup(circuit): Promise<any>;
}

const zokratesFactory = async (): Promise<ZoKratesProvider> => {
  return new Promise((resolve, reject) => {
    initialize().then(zokrates => {
      resolve(zokrates);
    }).catch(err => {
      reject(err);
    });
  });
};
