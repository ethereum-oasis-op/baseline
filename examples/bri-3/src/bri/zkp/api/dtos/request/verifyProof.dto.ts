import { IsNotEmpty } from 'class-validator';

export class VerifyProofDto {
  @IsNotEmpty()
  document: any;

  @IsNotEmpty()
  signature: string;
}
