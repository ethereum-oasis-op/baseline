import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  //bip39 string signed from Metamask
  message: string;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  publicKey: string;
}
