export class VerifyProofCommand {
  constructor(
    public readonly document: string,
    public readonly signature: string,
  ) {}
}
