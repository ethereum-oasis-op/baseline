export class UpdateBpiSubjectCommand {
    constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly desc: string,
      public readonly publicKey: string
    ) {}
  }