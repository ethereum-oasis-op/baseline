import { Organization as OrganizationResponse } from '@provide/types/dist/cjs/ident/organization';
import { Token as TokenResponse }               from '@provide/types/dist/cjs/ident/token';
import { Ident as PrvdIdent }                   from 'provide-js';
import { tryTimes }                             from '../src/utils';
import { UserHelper }                           from './user-helper';

export class OrganizationHelper {

  protected static authenticationScope = 'offline_access';

  public accessToken?: string;
  public refreshToken?: string;

  public creationResponse?: OrganizationResponse;
  public tokenResponse?: TokenResponse;
  public fetchedResponse?: OrganizationResponse;

  protected identScheme: string;
  protected identHost: string;

  protected _prvdIdent?: PrvdIdent;

  protected get prvdIdent(): PrvdIdent {
    if (this._prvdIdent) { return this._prvdIdent; }

    if (!this.accessToken) { throw new Error('missing organization access token for PrvdIdent'); }

    return PrvdIdent.clientFactory(
      this.accessToken,
      this.identScheme,
      this.identHost,
    );
  }

  constructor(
    identScheme: string,
    identHost: string,
  ) {
    this.identScheme = identScheme;
    this.identHost   = identHost;
  }

  public async create(
    userHelper: UserHelper,
    name: string,
    description: string,
    domain: string,
    natsHost: string,
  ): Promise<OrganizationResponse> {

    const organizationParams = {
      name,
      description,
      metadata: {
        domain,
        messaging_endpoint: natsHost,
      },
    };

    this.creationResponse = await userHelper.prvdIdent.createOrganization(
      organizationParams,
    );

    return this.creationResponse;
  }

  public async createToken(
    userHelper: UserHelper,
  ): Promise<TokenResponse> {

    return await tryTimes(async(): Promise<TokenResponse> => {
      if (!this.creationResponse) { throw new Error('must create organization before creating token for organization'); }

      if (!this.creationResponse.id) { throw new Error('missing organization id'); }

      const tokenParams = {
        organization_id: this.creationResponse.id,
        scope          : OrganizationHelper.authenticationScope,
      };

      this.tokenResponse = await userHelper.prvdIdent.createToken(tokenParams);

      if (this.tokenResponse) {
        this.accessToken  = this.tokenResponse.accessToken;
        this.refreshToken = this.tokenResponse.refreshToken;

        return this.tokenResponse;
      }

      throw new Error('failed to vend tokens for organization');
    });
  }

  public async fetch(
    userHelper: UserHelper,
  ): Promise<OrganizationResponse> {

    return await tryTimes(async(): Promise<OrganizationResponse> => {
      if (!this.creationResponse) { throw new Error('must create organization before creating token for organization'); }

      if (!this.creationResponse.id) { throw new Error('missing organization id'); }

      this.fetchedResponse = await userHelper.prvdIdent.fetchOrganizationDetails(this.creationResponse.id);

      if (this.fetchedResponse) { return this.fetchedResponse; }

      throw new Error('failed to fetch organization');
    });
  }

}
