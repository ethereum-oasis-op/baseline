import { MerkleProofWitness } from '../../models/merkleProofWItness';

export class CreateStateObjectCommand {
  constructor(
    public readonly id: string,
    public readonly proof: string,
    public readonly document: string,
    public readonly proverSystem: string,
    public readonly witness: MerkleProofWitness,
  ) {}
}
