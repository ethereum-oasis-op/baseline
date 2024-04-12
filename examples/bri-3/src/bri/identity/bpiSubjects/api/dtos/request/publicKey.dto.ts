import { IsNotEmpty } from 'class-validator';
export class PublicKeyDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  value: string;
}
