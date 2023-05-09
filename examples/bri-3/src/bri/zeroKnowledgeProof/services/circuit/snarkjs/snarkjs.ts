import snarkjs from 'snarkjs';
export class SnarkjsCircuitService {
  public async createProof(inputs: object) {
    const provingKey = await this.getProvingKey();

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputs,
      provingKey,
    );

    const verificationKey = await this.getVerificationKey();

    const witness = {
      proof,
      publicInputs: publicSignals,
      verificationKey,
    };

    return witness;
  }

  public async verifyProof(proof, publicInputs): Promise<boolean> {
    const verificationKey = await this.getVerificationKey();
    const isVerified = await snarkjs.groth16.verify(
      verificationKey,
      publicInputs,
      proof,
    );
    return isVerified;
  }

  private async getProvingKey(): Promise<string> {
    return 'provingKey';
  }

  private async getVerificationKey(): Promise<string> {
    return 'verificationKey';
  }
}
