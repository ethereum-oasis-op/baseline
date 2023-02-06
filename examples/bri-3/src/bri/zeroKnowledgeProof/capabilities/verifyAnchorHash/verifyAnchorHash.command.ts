export class VerifyAnchorHashCommand {
  constructor(
    public readonly inputForProofVerification: string,
    public readonly signature: string,
  ) {}
}
