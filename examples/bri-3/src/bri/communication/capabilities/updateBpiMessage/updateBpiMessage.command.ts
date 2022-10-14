export class UpdateBpiMessageCommand {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly signature: string,
  ) {}
}
