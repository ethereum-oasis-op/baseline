import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyCCSMAnchorHashDto {
  @IsNotEmpty()
  @IsString()
  inputForProofVerification: string;
}
