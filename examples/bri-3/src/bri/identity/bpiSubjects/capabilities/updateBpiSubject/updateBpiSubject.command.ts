import { PublicKey } from '../../models/publicKey';

export class UpdateBpiSubjectCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly publicKey: PublicKey,
  ) {}
}
