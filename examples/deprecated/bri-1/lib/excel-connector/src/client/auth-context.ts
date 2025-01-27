import { identClientFactory } from "provide-js";
import { TokenStr } from "../models/common";
import { AccessToken } from "./access-token";

export class AuthContext {
  private _refreshTokenStr: TokenStr;
  private _accessToken: AccessToken;

  constructor(refreshToken: TokenStr, accessToken?: AccessToken) {
    this._refreshTokenStr = refreshToken;
    this._accessToken = accessToken;
  }

  get refreshToken() : TokenStr {
      return this._refreshTokenStr;
  }

  get isExpired(): boolean {
    // return true;
    return new Date() > this._accessToken.expiresAt;
  }

  public async refresh(): Promise<AccessToken> {
    let identService = identClientFactory(this._refreshTokenStr);
    let params = { grant_type: "refresh_token" };
    const token = await identService.createToken(params);
    const expiresIn = parseInt(token["expiresIn"]);
    this._accessToken = new AccessToken(token.id, token.accessToken, expiresIn);
    return this._accessToken;
  }

  // eslint-disable-next-line no-unused-vars
  public async get<T>(action: (accessToken: TokenStr) => Promise<T>) {
    const accessToken = await this.getAccessToken();
    return await action(accessToken);
  }

  // eslint-disable-next-line no-unused-vars
  public async execute(action: (accessToken: TokenStr) => Promise<void>) {
    const accessToken = await this.getAccessToken();
    await action(accessToken);
  }

  private getAccessToken(): Promise<TokenStr> {
    if (this.isExpired) {
      return this.refresh().then((accessToken) => {
        return accessToken.accessTokenStr;
      });
    } else {
      return Promise.resolve(this._accessToken.accessTokenStr);
    }
  }
}
