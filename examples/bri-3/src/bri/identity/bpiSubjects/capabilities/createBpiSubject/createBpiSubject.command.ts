import { PublicKeyDto } from '../../api/dtos/request/publicKey.dto';
export class CreateBpiSubjectCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly publicKeys: PublicKeyDto[],
  ) {}
}
