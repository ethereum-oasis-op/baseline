import { BadRequestException, Injectable } from '@nestjs/common';
import { INVALID_ANCHOR_HASH_INPUT } from '../api/err.messages';
import { v4 as uuidv4 } from 'uuid';
import { CCSMAnchorHash } from '../models/ccsmAnchorHash';
import { CCSMAnchorHashStorageAgent } from './ccsmAnchorHashStorage.agent';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';
import { DocumentObject } from '../models/document';
import { ZeroKnowledgeProofVerificationInput } from '../models/zeroKnowledgeProofVerificationInput';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
@Injectable()
export class CCSMAnchorHashAgent {
  constructor(private readonly storageAgent: CCSMAnchorHashStorageAgent) {}

  public throwErrorIfCCSMAnchorHashInputInvalid(
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

  public createNewCCSMAnchorHash(
    owner: BpiSubjectAccount,
    agreementState: BpiAccount,
    document: DocumentObject,
    signature: string,
  ): CCSMAnchorHash {
    const hash =
      this.convertDocumentToHashAndThrowErrorIfDocumentValidationFails(
        document.documentObjectInput,
      );

    return new CCSMAnchorHash(uuidv4(), owner, agreementState, hash, signature);
  }

  public async verifyDocumentWithCCSMAnchorHash(
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
    const verified = await this.storageAgent.verifyCCSMAnchorHashOnCCSM(
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
