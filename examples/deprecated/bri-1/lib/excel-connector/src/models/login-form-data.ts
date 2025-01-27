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
    var emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    var passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])*[A-Za-z\d$@$!%*#?&]{8,}$/;

    if (!this.email || !this.password) {
      return "Email and password are required";
    } else if (!this.email.match(emailFormat)) {
      return "Email format is not valid";
    } else if (!this.password.match(passwordFormat)) {
      return "Password must contain minimum eight characters, at least one letter, one number and one special character ";
    } else {
      return true;
    }
  }

  clean(): void {
    this.$form.find("#email").val("");
    this.$form.find("#password").val("");
  }
}
