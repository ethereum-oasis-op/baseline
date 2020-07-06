import { zokratesServiceFactory } from './zokrates';

export const zkSnarkCircuitProviderServiceZokrates = 'zokrates';

export interface IZKSnarkCircuitProvider {
  compile(source: string, location: string): Promise<any>;
  computeWitness(artifacts: any, args: any[]): Promise<any>;
  exportVerifier(verifyingKey): Promise<string>;
  generateProof(circuit, witness, provingKey): Promise<string>;
  setup(circuit): Promise<any>;
}

export async function zkSnarkCircuitProviderServiceFactory(
  provider: string,
  config?: any,
): Promise<IZKSnarkCircuitProvider> {
  let service;

  switch (provider) {
    case zkSnarkCircuitProviderServiceZokrates:
      service = await zokratesServiceFactory(config);
      break;
    default:
      throw new Error('zkSnark circuit provider service required');
  }

  return service;
}
