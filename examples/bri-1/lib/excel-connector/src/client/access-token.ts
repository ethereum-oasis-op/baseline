import { Uuid, TokenStr } from "../models/common";

export class AccessToken {
  private readonly EXPIRES_DELTA = 60;

  id: Uuid;
  accessTokenStr: TokenStr;
  expiresAt: Date;

  constructor(id: Uuid, accessTokenStr: TokenStr, expiresIn: number) {
    this.id = id;
    this.accessTokenStr = accessTokenStr;
    this.expiresAt = expiresIn ? this.getExpiresAt(expiresIn) : new Date(0);
  }

  private getExpiresAt(expiresIn: number) {
    let expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn - this.EXPIRES_DELTA);
    return expiresAt;
  }
}
