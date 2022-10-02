export class UpdateBpiAccountCommand {
  constructor(public readonly id: string, public readonly nonce: string) {}
}
