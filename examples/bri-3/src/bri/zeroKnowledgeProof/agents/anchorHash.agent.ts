import { BadRequestException, Injectable } from '@nestjs/common';
import { INVALID_ANCHOR_HASH_INPUT } from '../api/err.messages';
import { v4 as uuidv4 } from 'uuid';
import { AnchorHash } from '../models/anchorHash';
import { AnchorHashStorageAgent } from './anchorHashStorage.agent';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';
import { DocumentObject } from '../models/document';
import { ZeroKnowledgeProofVerificationInput } from '../models/zeroKnowledgeProofVerificationInput';
@Injectable()
export class AnchorHashAgent {
  constructor(private storageAgent: AnchorHashStorageAgent) {}

  public throwErrorIfAnchorHashInputInvalid(document: DocumentObject): void {
    if (!document.documentObjectType || !document.documentObjectInput) {
      throw new BadRequestException(INVALID_ANCHOR_HASH_INPUT);
    }
  }

  public createNewAnchorHash(
    owner: BpiAccount,
    document: DocumentObject,
    signature: string,
  ): AnchorHash {
    const hash = this.convertDocumentToHashAndThrowIfDocumentValidationFails(
      document.documentObjectInput,
    );

    return new AnchorHash(uuidv4(), owner, hash, signature);
  }

  public async verifyDocumentWithAnchorHash(
    inputForProofVerification:
      | DocumentObject
      | ZeroKnowledgeProofVerificationInput,
  ): Promise<boolean> {
    let publicInput;
    if (inputForProofVerification instanceof DocumentObject) {
      publicInput = this.convertDocumentToHashAndThrowIfDocumentValidationFails(
        inputForProofVerification.documentObjectInput,
      );
    } else {
      publicInput = inputForProofVerification;
    }
    const verified = await this.storageAgent.verifyAnchorHashOnchain(
      publicInput,
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
