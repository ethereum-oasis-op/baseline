import { Injectable } from '@nestjs/common';
import { Witness } from '../../../models/witness';
import { Proof } from '../../../models/proof';
import { ICircuitService } from '../circuitService.interface';
import { computeEcdsaSigPublicInputs } from './utils/computePublicInputs';
import * as spartan from '@personaelabs/spartan-ecdsa/build/wasm';
import { Transaction } from '../../../../transactions/models/transaction';
import {
  calculateCircuitWitness,
  loadCircuit,
  deserialize,
} from './utils/spartan';
import { serialize } from 'v8';

@Injectable()
export class SpartanCircuitService implements ICircuitService {
  public witness: Witness;

  public async createWitness(
    inputs: {
      tx: Transaction;
    },
    circuitName: string,
    pathToCircuit: string,
    pathToCircuitWasm: string,
  ): Promise<Witness> {
    this.witness = new Witness();
    await spartan.init();

    const preparedInputs = await this.prepareInputs(inputs, circuitName);

    const { proof, publicInputs, circuitBinary } = await this.executeCircuit(
      preparedInputs,
      pathToCircuit,
      pathToCircuitWasm,
    );

    this.witness.proof = proof;

    this.witness.publicInputs = publicInputs;

    this.witness.circuitBinary = circuitBinary;

    return this.witness;
  }

  public async verifyProofUsingWitness(witness: Witness): Promise<boolean> {
    const circuitPubInput = serialize(
      (witness.publicInputs as string[]).map((input) => BigInt(input)),
    );

    const isVerified = spartan.default.verify(
      witness.circuitBinary as Uint8Array,
      witness.proof.value as Uint8Array,
      circuitPubInput,
    );
    return isVerified;
  }

  private async executeCircuit(
    inputs: object,
    pathToCircuit: string,
    pathToCircuitWasm: string,
  ): Promise<{
    proof: Proof;
    publicInputs: string[];
    circuitBinary: Uint8Array;
  }> {
    const witness = await calculateCircuitWitness(inputs, pathToCircuitWasm);

    const circuitBinary = await loadCircuit(pathToCircuit);

    //TODO: Add circuit public inputs ==> serialize(Object.values(inputs.public))
    const circuitPublicInputs: Uint8Array = new Uint8Array();

    const proof = spartan.default.prove(
      circuitBinary,
      witness.data,
      circuitPublicInputs,
    );

    const newProof = {
      value: proof,
      protocol: 'spartan',
      curve: 'secq256k1',
    } as Proof;

    const publicInputs = deserialize(circuitPublicInputs).map((input) =>
      input.toString(),
    );

    return { proof: newProof, publicInputs, circuitBinary };
  }

  private async prepareInputs(
    inputs: {
      tx: Transaction;
    },
    circuitName: string,
  ): Promise<object> {
    return await this[circuitName](inputs);
  }

  // TODO: Mil5 - How to parametrize this for different use-cases?
  private async workstep1(inputs: { tx: Transaction }): Promise<object> {
    //1. Ecdsa signature
    const { signature, Tx, Ty, Ux, Uy, publicKeyX, publicKeyY } =
      computeEcdsaSigPublicInputs(inputs.tx);

    //2. Items
    const payload = JSON.parse(inputs.tx.payload);

    const itemPrices: number[] = [];
    const itemAmount: number[] = [];

    payload.items.forEach((item: object) => {
      itemPrices.push(item['price']);
      itemAmount.push(item['amount']);
    });

    const preparedInputs = {
      invoiceStatus: this.calculateStringCharCodeSum(payload.status),
      invoiceAmount: payload.amount,
      itemPrices,
      itemAmount,
      signature,
      publicKeyX,
      publicKeyY,
      Tx,
      Ty,
      Ux,
      Uy,
    };

    return preparedInputs;
  }

  private calculateStringCharCodeSum(status: string): number {
    let sum = 0;

    for (let i = 0; i < status.length; i++) {
      sum += status.charCodeAt(i);
    }

    return sum;
  }
}
