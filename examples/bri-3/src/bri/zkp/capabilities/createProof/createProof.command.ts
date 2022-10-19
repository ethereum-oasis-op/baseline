export class CreateProofCommand {
  constructor(
    public readonly id: string,
    public readonly ownerAccountId: string,
    public readonly document: any,
    public readonly signature: string,
  ) {}
}
