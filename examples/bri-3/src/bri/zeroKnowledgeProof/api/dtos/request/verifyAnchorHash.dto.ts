import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAnchorHashDto {
  @IsNotEmpty()
  @IsString()
  inputForProofVerification: string;
}
