import { IsNotEmpty } from 'class-validator';

export class VerifyCcsmAnchorHashDto {
  @IsNotEmpty()
  inputForProofVerification: string;
}
