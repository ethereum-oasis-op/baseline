export class CreateBpiSubjectCommand {

  name: string;
  description: string;
  publicKey: string;

    constructor(init : CreateBpiSubjectCommand) {
      Object.assign(this, init);
    }
  }
