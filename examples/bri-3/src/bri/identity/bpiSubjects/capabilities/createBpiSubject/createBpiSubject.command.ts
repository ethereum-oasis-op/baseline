import { PublicKey } from '../../models/publicKey';
export class CreateBpiSubjectCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly publicKey: PublicKey,
  ) {}
}
