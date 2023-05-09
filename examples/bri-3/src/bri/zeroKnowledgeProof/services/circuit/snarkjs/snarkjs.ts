export class SnarkjsCircuitService {
  public async createProof(inputs: object) {
    const provingKey = await this.getProvingKey();
    return { proof: 'proof', publicInput: 'publicInput' };
  }

  public async verifyProof(proof, publicInputs): Promise<boolean> {
    const verificationKey = await this.getVerificationKey();
    return true;
  }

  private async getProvingKey(): Promise<string> {
    return 'provingKey';
  }

  private async getVerificationKey(): Promise<string> {
    return 'verificationKey';
  }
}
