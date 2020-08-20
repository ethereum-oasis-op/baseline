import { zokratesServiceFactory } from './zokrates';

export const zkSnarkCircuitProviderServiceZokrates = 'zokrates';

export interface IZKSnarkCircuitProvider {
  compile(source: string, location: string): Promise<IZKSnarkCompilationArtifacts>;
  computeWitness(artifacts: IZKSnarkCompilationArtifacts, args: any[]): Promise<IZKSnarkWitnessComputation>;
  exportVerifier(verifyingKey: any): Promise<any>;
  generateProof(circuit: any, witness: any, provingKey: any): Promise<any>;
  setup(circuit: any): Promise<IZKSnarkTrustedSetupArtifacts>;
}

export interface IZKSnarkCompilationArtifacts {
  program: Uint8Array,
  abi: string,
}

export type IZKSnarkTrustedSetupArtifacts = {
  identifier?: string;
  keypair?: IZKSnarkTrustedSetupKeypair;
  verifierSource?: string;
}

export type IZKSnarkTrustedSetupKeypair = {
  vk: string;
  pk: Uint8Array;
}

export type IZKSnarkWitnessComputation = {
  witness: string;
  output: string;
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
