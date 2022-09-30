export class UpdateTransactionCommand {
  constructor(
    public readonly id: string,
    public readonly payload: string,
    public readonly signature: string,
  ) {}
}
