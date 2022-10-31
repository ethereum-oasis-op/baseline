export class CreateProofCommand {
  constructor(
    public readonly ownerAccountId: string,
    public readonly document: any,
    public readonly signature: string,
  ) {}
}
