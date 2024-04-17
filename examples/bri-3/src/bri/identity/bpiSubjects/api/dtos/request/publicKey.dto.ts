import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';
export class PublicKeyDto {
  @AutoMap()
  @IsNotEmpty()
  type: string;

  @AutoMap()
  @IsNotEmpty()
  value: string;
}
