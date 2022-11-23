import { DocumentObject } from '../../models/document';
import { ZeroKnowledgeProofVerificationInput } from '../../models/zeroKnowledgeProofVerificationInput';

export class VerifyCCSMAnchorHashCommand {
  constructor(
    public readonly inputForProofVerification:
      | DocumentObject
      | ZeroKnowledgeProofVerificationInput,
    public readonly signature: string,
  ) {}
}
