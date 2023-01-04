import { IsNotEmpty } from 'class-validator';

export class GenerateNonceDto {
  @IsNotEmpty()
  publicKey: string;
}
