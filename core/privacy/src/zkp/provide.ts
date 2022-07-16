import { IProverVerifier, IProverRegistry, IProverProver } from '.';
import { Privacy } from 'provide-js';
import { Prover } from '@baseline-protocol/types';
import { ProveResponse, VerifyResponse } from '@provide/types';

/**
 * This class is the Provide Privacy implementation
 * for the core baseline privacy package.
 */
export class ProvideService implements IProverProver, IProverRegistry, IProverVerifier {

  // Provide enterprise-grade privacy API
  private provide: Privacy;

  constructor(
    private readonly config: any,
  ) {
    if (!config || !config.token) {
      throw new Error('privacy service requires config and bearer authorization token');
    }

    // this.proverId = config.proverId;
    this.provide = Privacy.clientFactory(config.token, config.privacyApiScheme, config.privacyApiHost);
  }

  // all-in-one convenience of compiling, running trusted setup (if applicable) and registering artifacts (i.e. r1cs, pk, vk)
  async deploy(params: any): Promise<Prover> {
    return await this.provide.deployProver(params) as Prover;
  }

  async fetchProver(proverId: string): Promise<Prover> {
    return await this.provide.fetchProverDetails(proverId) as Prover;
  }

  async fetchProvers(params: any): Promise<Prover[]> {
    return await this.provide.fetchProvers(params) as Prover[];
  }

  async prove(proverId: string, params: any): Promise<ProveResponse> {
    return await this.provide.prove(proverId, params);
  }

  async verify(proverId: string, params: any): Promise<VerifyResponse> {
    return await this.provide.verify(proverId, params);
  }
}

export const provideServiceFactory = async (config?: any): Promise<ProvideService> => {
  return new ProvideService(config);
};
