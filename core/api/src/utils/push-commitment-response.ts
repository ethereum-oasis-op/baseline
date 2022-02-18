import { Commitment } from "./commitment";

export class PushCommitmentResponse {

  readonly commitment?: Commitment;
  readonly txHash?: string;

  constructor(commitment?: Commitment, txHash?: string) {
    this.commitment = commitment;
    this.txHash = txHash;
  }
}
