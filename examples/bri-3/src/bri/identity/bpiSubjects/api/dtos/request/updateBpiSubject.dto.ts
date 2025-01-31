import { IsNotEmpty } from 'class-validator';
import { PublicKeyDto } from './publicKey.dto';

export class UpdateBpiSubjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  publicKeys: PublicKeyDto[];
}
