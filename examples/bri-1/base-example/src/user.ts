import { Ident } from 'provide-js';

export class User {

  protected static authScope = 'offline_access';

  public id: string;
  public name: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public permissions: number;
  public accessToken: string;
  public refreshToken: string;

  constructor(
    id: string,
    name: string,
    firstName: string,
    lastName: string,
    email: string,
    permissions: number,
    accessToken: string,
    refreshToken: string,
  ) {
    this.id           = id;
    this.name         = name;
    this.firstName    = firstName;
    this.lastName     = lastName;
    this.email        = email;
    this.permissions  = permissions;
    this.accessToken  = accessToken;
    this.refreshToken = refreshToken;
  }

  public static async create(
    identScheme: string,
    identHost: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<User> {

    const now = new Date().toISOString();

    const userParams = {
      first_name                : firstName,
      last_name                 : lastName,
      email                     : email,
      password                  : password,
      privacy_policy_agreed_at  : now,
      terms_of_service_agreed_at: now,
    };

    const user = await Ident.createUser(
      userParams,
      identScheme,
      identHost,
    );

    const authParams = {
      email   : email,
      password: password,
      scope   : User.authScope,
    };

    const auth = await Ident.authenticate(
      authParams,
      identScheme,
      identHost,
    );

    const token = JSON.parse(JSON.stringify(auth.token));

    return new User(
      user.id || '',
      user.name || '',
      user.firstName,
      user.lastName,
      user.email,
      user.permissions || NaN,
      token.access_token,
      token.refresh_token,
    );
  }

}
