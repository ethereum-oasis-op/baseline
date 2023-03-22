export class CreateMerkleTreeCommand {
  constructor(
    public readonly leaves: string[],
    public readonly hashFunction: unknown,
  ) {}
}
