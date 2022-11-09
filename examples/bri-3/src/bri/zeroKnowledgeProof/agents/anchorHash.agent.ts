import { BadRequestException, Injectable } from '@nestjs/common';
import { INVALID_ANCHOR_HASH_INPUT } from '../api/err.messages';
import { v4 as uuidv4 } from 'uuid';
import { AnchorHash } from '../models/anchorHash';
import { AnchorHashStorageAgent } from './anchorHashStorage.agent';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';
import { DocumentObject } from '../models/document';
import { ZeroKnowledgeProofVerificationInput } from '../models/zeroKnowledgeProofVerificationInput';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
@Injectable()
export class AnchorHashAgent {
  constructor(private storageAgent: AnchorHashStorageAgent) {}

  public throwErrorIfAnchorHashInputInvalid(document: DocumentObject): void {
    if (!document.documentObjectType || !document.documentObjectInput) {
      throw new BadRequestException(INVALID_ANCHOR_HASH_INPUT);
    }
  }

  public createNewAnchorHash(
    owner: BpiSubjectAccount,
    agreementState: BpiAccount,
    document: DocumentObject,
    signature: string,
  ): AnchorHash {
    const hash = this.convertDocumentToHashAndThrowIfDocumentValidationFails(
      document.documentObjectInput,
    );

    return new AnchorHash(uuidv4(), owner, agreementState, hash, signature);
  }

  public async verifyDocumentWithAnchorHash(
    inputForProofVerification:
      | DocumentObject
      | ZeroKnowledgeProofVerificationInput,
  ): Promise<boolean> {
    let publicInputForProofVerification;
    if (inputForProofVerification instanceof DocumentObject) {
      publicInputForProofVerification =
        this.convertDocumentToHashAndThrowIfDocumentValidationFails(
          inputForProofVerification.documentObjectInput,
        );
    } else {
      publicInputForProofVerification = inputForProofVerification;
    }
    const verified = await this.storageAgent.verifyAnchorHashOnchain(
      publicInputForProofVerification,
    );
    return verified;
  }

  public convertDocumentToHashAndThrowIfDocumentValidationFails(
    document: object,
  ) {
    //TODO: Convert document into payload using merkleTree service
    const hash = Object.keys(document)[0];
    return hash;
  }
}
