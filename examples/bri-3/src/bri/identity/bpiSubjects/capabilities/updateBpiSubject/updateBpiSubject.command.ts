import { PublicKeyDto } from '../../api/dtos/request/publicKey.dto';
export class UpdateBpiSubjectCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly publicKeys: PublicKeyDto[],
  ) {}
}
