import { IsNotEmpty } from 'class-validator';
import { ZeroKnowledgeProofVerificationInput } from '../../../models/zeroKnowledgeProofVerificationInput';
import { DocumentObject } from '../../../models/document';

export class VerifyAnchorHashDto {
  @IsNotEmpty()
  inputForProofVerification:
    | DocumentObject
    | ZeroKnowledgeProofVerificationInput;

  @IsNotEmpty()
  signature: string;
}
