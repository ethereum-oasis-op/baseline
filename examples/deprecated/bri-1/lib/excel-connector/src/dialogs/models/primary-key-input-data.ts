//NOTE: Structs for primaryKeyInputDialog

import { Uuid } from "../../models/common";

export interface PrimaryKeyInputResult {
  primaryKey: Uuid;

}

export class PrimaryKeyInputData implements PrimaryKeyInputResult {
  // eslint-disable-next-line no-undef
  private $form: JQuery;
  public primaryKey: Uuid;


  // eslint-disable-next-line no-undef
  constructor($form: JQuery) {
    this.$form = $form;
    this.primaryKey = <string>$form.find("#primary-key-txt").val();
    
  }

  isValid(): boolean | string {
    const validResults = [this.isPrimaryKeyValid()];
    if (validResults.every((x) => x === true)) {
      return true;
    }

    return validResults.filter((x) => x !== true).join("; ");
  }

  clean(): void {
    this.$form.find("#primary-key-txt").val("");
  }

  toJSON() {
    return {
      primaryKey: this.primaryKey
    };
  }

  private isPrimaryKeyValid(): boolean | string {
    if (!this.primaryKey) {
      return "Primary Key is required";
    }


    return true;
  }

}
