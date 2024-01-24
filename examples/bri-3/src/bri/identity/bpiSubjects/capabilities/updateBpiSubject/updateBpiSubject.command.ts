export class UpdateBpiSubjectCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly publicKey: { type: string; value: string },
  ) {}
}
