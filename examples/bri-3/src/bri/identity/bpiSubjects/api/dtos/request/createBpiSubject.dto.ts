import { IsNotEmpty } from 'class-validator';
import { PublicKeyDto } from './publicKey.dto';

export class CreateBpiSubjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  publicKeys: PublicKeyDto[];
}
