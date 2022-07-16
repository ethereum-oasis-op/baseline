import { Prover } from '@baseline-protocol/types';
import { provideServiceFactory } from './provide';
import { zokratesServiceFactory } from './zokrates';
import { VerificationKey } from 'zokrates-js/node';

export const zkSnarkProverProviderServiceProvide = 'provide';
export const zkSnarkProverProviderServiceZokrates = 'zokrates';

export interface IProverProver {
  prove(proverId: any, params: any): Promise<any>;
}

export interface IProverRegistry {
  deploy(params: any): Promise<Prover>; // deploy a prover to the registry
  fetchProver(proverId: string): Promise<Prover>;
  fetchProvers(params: any): Promise<Prover[]>;
}

export interface IProverVerifier {
  verify(proverId: any, params: any): Promise<any>;
}

export interface IZKSnarkProverProvider {
  compile(source: string, location: string): Promise<IZKSnarkCompilationArtifacts>;
  computeWitness(artifacts: IZKSnarkCompilationArtifacts, argv: any[]): Promise<IZKSnarkWitnessComputation>;
  exportVerifier(verifyingKey: VerificationKey): Promise<any>;
  generateProof(prover: any, params: any, provingKey?: any): Promise<any>;
  setup(prover: any): Promise<IZKSnarkTrustedSetupArtifacts>;
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
  vk: VerificationKey;
  pk: Uint8Array;
}

export type IZKSnarkWitnessComputation = {
  witness: string;
  output: string;
}

export async function zkSnarkProverProviderServiceFactory(
  provider: string,
  config?: any,
): Promise<IZKSnarkProverProvider> {
  let service;

  switch (provider) {
    case zkSnarkProverProviderServiceProvide:
      service = await provideServiceFactory(config);
      break;
    case zkSnarkProverProviderServiceZokrates:
      service = await zokratesServiceFactory(config);
      break;
    default:
      throw new Error('zkSnark prover provider service required');
  }

  return service;
}
