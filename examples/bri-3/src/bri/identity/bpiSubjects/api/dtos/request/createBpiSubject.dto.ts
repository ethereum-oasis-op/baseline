import { IsNotEmpty } from 'class-validator';
import { PublicKeyDto } from './publicKey.dto';
import { Type } from 'class-transformer';

export class CreateBpiSubjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  @Type(() => PublicKeyDto)
  publicKeys: PublicKeyDto[];
}
