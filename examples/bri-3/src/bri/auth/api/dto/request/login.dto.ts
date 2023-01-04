import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  publicKey: string;
}
