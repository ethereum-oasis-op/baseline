import { BadRequestException, Injectable } from '@nestjs/common';
import { INVALID_ANCHOR_HASH_INPUT } from '../api/err.messages';
import { v4 as uuidv4 } from 'uuid';
import { CcsmAnchorHash } from '../models/ccsmAnchorHash';
import { CcsmAnchorHashStorageAgent } from './ccsmAnchorHashStorage.agent';
@Injectable()
export class CcsmAnchorHashAgent {
  constructor(private readonly storageAgent: CcsmAnchorHashStorageAgent) {}

  public throwErrorIfCcsmAnchorHashInputInvalid(
    inputForProofVerification:
      | DocumentObject
      | ZeroKnowledgeProofVerificationInput,
  ): void {
    if (
      inputForProofVerification instanceof DocumentObject &&
      (!inputForProofVerification.documentObjectInput ||
        !inputForProofVerification.documentObjectType)
    ) {
      throw new BadRequestException(INVALID_ANCHOR_HASH_INPUT);
    }
  }

  public createNewCcsmAnchorHash(
    ownerId: string,
    document: DocumentObject,
  ): CcsmAnchorHash {
    const hash =
      this.convertDocumentToHashAndThrowErrorIfDocumentValidationFails(
        document.documentObjectInput,
      );

    return new CcsmAnchorHash(uuidv4(), ownerId, hash);
  }

  public async verifyDocumentWithCcsmAnchorHash(
    inputForProofVerification:
      | DocumentObject
      | ZeroKnowledgeProofVerificationInput,
  ): Promise<boolean> {
    let publicInputForProofVerification;
    if (inputForProofVerification instanceof DocumentObject) {
      publicInputForProofVerification =
        this.convertDocumentToHashAndThrowErrorIfDocumentValidationFails(
          inputForProofVerification.documentObjectInput,
        );
    } else {
      publicInputForProofVerification = inputForProofVerification;
    }
    const verified = await this.storageAgent.verifyCcsmAnchorHashOnCcsm(
      publicInputForProofVerification,
    );
    return verified;
  }

  public convertDocumentToHashAndThrowErrorIfDocumentValidationFails(
    document: object,
  ) {
    //TODO: Convert document into payload using merkleTree service
    const hash = Object.values(document)[0];
    return hash;
  }
}
