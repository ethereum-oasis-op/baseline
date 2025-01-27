//NOTE: Structs for jwtInputDialog

import { Uuid, TokenStr } from "../../models/common";
import * as jwt from "jsonwebtoken";
import * as validate from "uuid-validate";

export interface JwtInputResult {
  orgId: Uuid;
  jwt: TokenStr;
}

export class JwtInputData implements JwtInputResult {
  // eslint-disable-next-line no-undef
  private $form: JQuery;
  public orgId: Uuid;
  public jwt: TokenStr;

  // eslint-disable-next-line no-undef
  constructor($form: JQuery) {
    this.$form = $form;
    this.orgId = <string>$form.find("#org-id-txt").val();
    this.jwt = <string>$form.find("#jwt-txt").val();
  }

  isValid(): boolean | string {
    const validResults = [this.isOrgIdValid(), this.isJwtValid()];
    if (validResults.every((x) => x === true)) {
      return true;
    }

    return validResults.filter((x) => x !== true).join("; ");
  }

  clean(): void {
    this.$form.find("#org-id-txt").val("");
    this.$form.find("#jwt-txt").val("");
  }

  toJSON() {
    return {
      orgId: this.orgId,
      jwt: this.jwt,
    };
  }

  private isOrgIdValid(): boolean | string {
    if (!this.orgId) {
      return "Organization Id is required";
    }

    if (!validate(this.orgId)) {
      return "Organization Id is invalid";
    }

    return true;
  }

  private isJwtValid(): boolean | string {
    if (!this.jwt) {
      return "JWT is required";
    }

    const decoded = jwt.decode(this.jwt);
    if (!decoded) {
      return "JWT is invalid";
    }

    return true;
  }
}
