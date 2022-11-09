import { DocumentObject } from '../../models/document';
import { ZeroKnowledgeProofVerificationInput } from '../../models/zeroKnowledgeProofVerificationInput';

export class VerifyAnchorHashCommand {
  constructor(
    public readonly inputForProofVerification:
      | DocumentObject
      | ZeroKnowledgeProofVerificationInput,
    public readonly signature: string,
  ) {}
}
