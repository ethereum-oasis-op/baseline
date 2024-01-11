import { PublicKey } from '../../../identity/bpiSubjects/models/publicKey';
export class LoginCommand {
  constructor(
    public readonly message: string,
    public readonly signature: string,
    public readonly publicKey: PublicKey,
  ) {}
}
