export class VerifyProofCommand {
  constructor(
    public readonly document: any,
    public readonly signature: string,
  ) {}
}
