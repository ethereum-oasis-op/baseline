import { AuthParams } from "./auth-params";

export class LoginFormData implements AuthParams {
  // eslint-disable-next-line no-undef
  private $form: JQuery;
  public email: string;
  public password: string;

  // eslint-disable-next-line no-undef
  constructor($form: JQuery) {
    this.$form = $form;
    this.email = <string>$form.find("#email").val();
    this.password = <string>$form.find("#password").val();
  }

  isValid(): boolean | string {
    if (this.email && this.password) {
      return true;
    } else {
      return "Email and password are required";
    }
  }

  clean(): void {
    this.$form.find("#email").val("");
    this.$form.find("#password").val("");
  }
}
