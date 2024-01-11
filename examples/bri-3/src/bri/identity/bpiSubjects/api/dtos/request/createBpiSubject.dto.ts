import { IsNotEmpty } from 'class-validator';
import { PublicKey } from '../../../models/publicKey';

export class CreateBpiSubjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  publicKey: PublicKey;
}
