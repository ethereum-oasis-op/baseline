export class UpdateMerkleTreeCommand {
  constructor(
    public readonly id: string,
    public readonly leaves: string[],
    public readonly hashFunction: string,
  ) {}
}
