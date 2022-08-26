export class CreateBpiSubjectCommand {
    constructor(
      public readonly name: string,
      public readonly desc: string,
      public readonly publicKey: string
    ) {}
  }