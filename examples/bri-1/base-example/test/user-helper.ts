import { User as UserResponse }   from '@provide/types/dist/cjs/ident/user';
import { AuthenticationResponse } from '@provide/types/dist/cjs/ident/authentication-response';
import { Ident as PrvdIdent }     from 'provide-js';
import { tryTimes }               from '../src/utils';

export class UserHelper {

  protected static authenticationScope = 'offline_access';

  public accessToken?: string;
  public refreshToken?: string;

  public creationResponse?: UserResponse;
  public authenticationResponse?: AuthenticationResponse;
  public fetchedResponse?: UserResponse;

  protected identScheme: string;
  protected identHost: string;

  protected _prvdIdent?: PrvdIdent;

  public get prvdIdent(): PrvdIdent {
    if (this._prvdIdent) { return this._prvdIdent; }

    if (!this.accessToken) { throw new Error('missing user access token for PrvdIdent'); }

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
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<UserResponse> {

    const now = new Date().toISOString();

    const userParams = {
      first_name                : firstName,
      last_name                 : lastName,
      email                     : email,
      password                  : password,
      privacy_policy_agreed_at  : now,
      terms_of_service_agreed_at: now,
    };

    this.creationResponse = await PrvdIdent.createUser(
      userParams,
      this.identScheme,
      this.identHost,
    );

    return this.creationResponse;
  }

  public async authenticate(
    email: string,
    password: string,
  ): Promise<AuthenticationResponse> {

    const authenticationParams = {
      email   : email,
      password: password,
      scope   : UserHelper.authenticationScope,
    };

    return await tryTimes(async(): Promise<AuthenticationResponse> => {

      if (!this.creationResponse) { throw new Error('must create user before authenticate user'); }

      this.authenticationResponse = await PrvdIdent.authenticate(
        authenticationParams,
        this.identScheme,
        this.identHost,
      );

      if (this.authenticationResponse) {
        const token = JSON.parse(JSON.stringify(this.authenticationResponse.token));

        this.accessToken  = token.access_token;
        this.refreshToken = token.refresh_token;

        return this.authenticationResponse;
      }

      throw new Error();
    });
  }

  public async fetch(): Promise<UserResponse> {
    return await tryTimes(async(): Promise<UserResponse> => {
      if (!this.creationResponse) { throw new Error('must create user before fetch user'); }

      if (!this.creationResponse.id) { throw new Error('missing user id'); }

      this.fetchedResponse = await this.prvdIdent.fetchUserDetails(this.creationResponse.id);

      if (this.fetchedResponse) { return this.fetchedResponse; }

      throw new Error('failed to fetch user');
    });
  }

}
