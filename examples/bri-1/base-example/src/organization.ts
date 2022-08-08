import { Ident } from 'provide-js';

export class Organization {

  protected static authScope = 'offline_access';

  public id: string;
  public name: string;
  public description: string;
  public domain: string;
  public messagingEndpoint: string;
  public permissions: number;
  public accessToken: string;
  public refreshToken: string;

  constructor(
    id: string,
    name: string,
    description: string,
    domain: string,
    messagingEndpoint: string,
    permissions: number,
    accessToken: string,
    refreshToken: string,
  ) {
    this.id                = id;
    this.name              = name;
    this.description       = description;
    this.domain            = domain;
    this.messagingEndpoint = messagingEndpoint;
    this.permissions       = permissions;
    this.accessToken       = accessToken;
    this.refreshToken      = refreshToken;
  }

  public static async create(
    userAccessToken: string,
    identScheme: string,
    identHost: string,
    natsHost: string,
    name: string,
    description: string,
    domain: string,
  ): Promise<Organization> {

    const ident = Ident.clientFactory(
      userAccessToken,
      identScheme,
      identHost,
    );

    const organizationParams = {
      name,
      description,
      metadata: {
        domain,
        messaging_endpoint: natsHost,
      },
    };

    const organization = await ident.createOrganization(
      organizationParams,
    );

    const tokenParams = {
      organization_id: organization.id,
      scope          : Organization.authScope,
    };

    const token = await ident.createToken(
      tokenParams,
    );

    return new Organization(
      organization.id || '',
      organization.name,
      organization.description || '',
      domain,
      natsHost,
      token.permission || NaN,
      token.accessToken || '',
      token.refreshToken || '',
    );
  }

}
