import { IsNotEmpty } from 'class-validator';
import { PublicKey } from '../../../../identity/bpiSubjects/models/publicKey';

export class LoginDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  publicKey: PublicKey;
}
