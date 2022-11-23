import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyCcsmAnchorHashDto {
  @IsNotEmpty()
  @IsString()
  inputForProofVerification: string;
}
