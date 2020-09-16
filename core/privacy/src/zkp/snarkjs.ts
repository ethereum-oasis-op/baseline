// import { groth16, powersOfTau, r1cs, wtns, zKey } from 'snarkjs';
import { IZKSnarkCircuitProvider, IZKSnarkCompilationArtifacts, IZKSnarkWitnessComputation, IZKSnarkTrustedSetupArtifacts } from '.';

export class SnarkjsService implements IZKSnarkCircuitProvider {

  private config: any;

  constructor(
    config: any,
  ) {
    this.config = config;
  }

  async compile(source: string, location: string): Promise<IZKSnarkCompilationArtifacts> {
    throw new Error('not implemented');
  }

  async computeWitness(artifacts: IZKSnarkCompilationArtifacts, args: any[]): Promise<IZKSnarkWitnessComputation> {
    throw new Error('not implemented');
  }

  async exportVerifier(verifyingKey: any): Promise<string> {
    throw new Error('not implemented');
  }

  async generateProof(circuit: any, witness: string, provingKey: any): Promise<any> {
    throw new Error('not implemented');
  }

  async setup(circuit: any): Promise<IZKSnarkTrustedSetupArtifacts> {
    throw new Error('not implemented');
  }
}

export const snarkjsServiceFactory = async (config?: any): Promise<SnarkjsService> => {
  return new SnarkjsService(config);
};
