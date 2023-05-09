import snarkjs from 'snarkjs';
import { Witness } from '../../../models/witness';
export class SnarkjsCircuitService {
  public async createProof(input: object) {
    const provingKey = await this.getProvingKey();

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      provingKey,
    );

    const verificationKey = await this.getVerificationKey();

    const witness: Witness = {
      proof,
      publicInput: publicSignals,
      verificationKey,
    };

    return witness;
  }

  public async verifyProof(witness: Witness): Promise<boolean> {
    const isVerified = await snarkjs.groth16.verify(
      witness.verificationKey,
      witness.publicInput,
      witness.proof,
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
