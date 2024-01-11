import { IsNotEmpty } from 'class-validator';

export class GenerateNonceDto {
  @IsNotEmpty()
  ecdsaPublicKey: string;
}
