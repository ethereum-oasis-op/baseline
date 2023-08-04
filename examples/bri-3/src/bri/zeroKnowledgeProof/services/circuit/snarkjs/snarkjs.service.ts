import { Injectable } from '@nestjs/common';
import { Witness } from '../../../models/witness';
import { Proof } from '../../../models/proof';
import { ICircuitService } from '../circuit.interface';
import * as snarkjs from 'snarkjs';
import 'dotenv/config';

@Injectable()
export class SnarkjsCircuitService implements ICircuitService {
  public witness: Witness;

  public async createWitness(
    inputs: object,
    circuitName: string,
  ): Promise<Witness> {
    this.witness = new Witness();

    const preparedInputs = await this.prepareInputs(inputs, circuitName);

    const { proof, publicInputs } = await this.executeCircuit(
      preparedInputs,
      circuitName,
    );

    this.witness.proof = proof;

    this.witness.publicInputs = publicInputs;

    this.witness.verificationKey = await import(
      `../../../../../../zeroKnowledgeKeys/circuit/${circuitName}_verification_key.json`
    );
    return this.witness;
  }

  public async verifyProofUsingWitness(witness: Witness): Promise<boolean> {
    const isVerified = await snarkjs.groth16.verify(
      witness.verificationKey,
      witness.publicInputs,
      {
        pi_a: witness.proof.a,
        pi_b: witness.proof.b,
        pi_c: witness.proof.c,
        protocol: witness.proof.protocol,
        curve: witness.proof.curve,
      },
    );
    return isVerified;
  }

  private async executeCircuit(
    inputs: object,
    circuitName: string,
  ): Promise<{ proof: Proof; publicInputs: string[] }> {
    const { proof, publicSignals: publicInputs } =
      await snarkjs.groth16.fullProve(
        inputs,
        `zeroKnowledgeKeys/circuit/${circuitName}_js/${circuitName}.wasm`,
        `zeroKnowledgeKeys/circuit/${circuitName}_final.zkey`,
      );

    const newProof = {
      a: proof.pi_a,
      b: proof.pi_b,
      c: proof.pi_c,
      protocol: proof.protocol,
      curve: proof.curve,
    } as Proof;

    return { proof: newProof, publicInputs };
  }

  private async prepareInputs(
    inputs: object,
    circuitName: string,
  ): Promise<object> {
    return await this[circuitName](inputs);
  }

  private async workstep(inputs: object): Promise<object> {
    const preparedInputs = {
      inputValueA: inputs['inputValueA'],
      inputValueB: inputs['inputValueB'],
    };

    return preparedInputs;
  }
}
