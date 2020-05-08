import { Ident, Goldmine, Vault } from 'provide-js';
import { ProvideConfig } from './config';
import { IBlockchainService } from '../..';

/**
 * This service provides access to the APIs exposed by the
 * Provide microservice architecture. This enables the
 * use of the automated subsidy faucet on certain testnets
 * when a broadcast transaction fails due to insufficient
 * funds.
 */
export class ProvideService implements IBlockchainService {

  // Ident provides identity, authn & authz
  private ident: Ident;

  // Ident provides identity, authn & authz
  private goldmine: Goldmine;

  // Vault provides privacy-focused key management
  private vault: Vault;

  constructor(
    private readonly config: ProvideConfig,
  ) {
    if (!config || !config.token) {
      throw new Error('provide jwt required');
    }

    // tslint:disable: no-non-null-assertion
    this.ident = Ident.clientFactory(config.token!);
    this.goldmine = Goldmine.clientFactory(config.token!);
    this.vault = Vault.clientFactory(config.token!);
  }

  async fetchTxReceipt(hash: string): Promise<any> {
    return this.goldmine.fetchTransactionDetails(hash);
  }

  async generateKeyPair(): Promise<any> {
    return this.goldmine.createAccount({});
  }

  async broadcast(tx: string): Promise<any> {
    return this.goldmine.createTransaction({
      raw: tx,
    });
  }

  async sign(payload: string): Promise<any> {
    throw new Error('impl pending');
  }
}
