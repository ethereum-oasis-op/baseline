import { Vault as VaultResponse } from '@provide/types/dist/cjs/vault/vault';
import { Vault as PrvdVault }     from 'provide-js';
import { tryTimes }               from '../src/utils';
import { OrganizationHelper }     from './organization-helper';

export class VaultHelper {

  public creationResponse?: VaultResponse;
  public fetchedResponse?: VaultResponse;

  protected vaultScheme: string;
  protected vaultHost: string;
  protected organizationHelper: OrganizationHelper;

  protected _prvdVault?: PrvdVault;

  protected get prvdVault(): PrvdVault {
    if (this._prvdVault) { return this._prvdVault; }

    if (!this.organizationHelper.accessToken) { throw new Error('missing organization access token for PrvdVault'); }

    return PrvdVault.clientFactory(
      this.organizationHelper.accessToken,
      this.vaultScheme,
      this.vaultHost,
    );
  }

  constructor(
    vaultScheme: string,
    vaultHost: string,
    organizationHelper: OrganizationHelper,
  ) {
    this.vaultScheme        = vaultScheme;
    this.vaultHost          = vaultHost;
    this.organizationHelper = organizationHelper;
  }

  public async create(
    name: string,
    description: string,
  ): Promise<VaultResponse> {

    const vaultParams = {
      name,
      description,
    };

    this.creationResponse = await this.prvdVault.createVault(
      vaultParams,
    );

    return this.creationResponse;
  }

  public async fetch(): Promise<VaultResponse> {
    return await tryTimes(async(): Promise<VaultResponse> => {
      const page = await this.prvdVault.fetchVaults({rpp: 1});

      if (page && page.results && page.results.length) {
        this.fetchedResponse = page.results[0];

        return this.fetchedResponse;
      }

      throw new Error('failed to fetch organization');
    });
  }

}
