import { MerkleProofWitness } from '../../models/merkleProofWItness';

export class UpdateStateObjectCommand {
  constructor(
    public readonly id: string,
    public readonly proof: string,
    public readonly document: string,
    public readonly proverSystem: string,
    public readonly witness: MerkleProofWitness,
  ) {}
}
