import { BadRequestException, Injectable } from '@nestjs/common';
import { INVALID_ANCHOR_HASH_INPUT } from '../api/err.messages';
import { v4 as uuidv4 } from 'uuid';
import { AnchorHash } from '../models/anchorHash';
import { AnchorHashStorageAgent } from './anchorHashStorage.agent';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';
import { DocumentObject } from '../models/document';
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
    const hash = this.convertDocumentToPayloadAndThrowIfDocumentValidationFails(
      document.documentObjectInput,
    );

    return new AnchorHash(uuidv4(), owner, hash, signature);
  }

  public async verifyDocumentWithAnchorHash(
    document?: DocumentObject,
    publicWitnessForProofVerification?: string,
    proof?: string,
    verificationKey?: string,
  ): Promise<boolean> {
    if (!publicWitnessForProofVerification) {
      publicWitnessForProofVerification =
        this.convertDocumentToPayloadAndThrowIfDocumentValidationFails(
          document.documentObjectInput,
        );
    }
    const verified = await this.storageAgent.verifyAnchorHashOnchain(
      publicWitnessForProofVerification,
      proof,
      verificationKey,
    );
    return verified;
  }

  public convertDocumentToPayloadAndThrowIfDocumentValidationFails(
    document: object,
  ) {
    //TODO: Convert document into payload using merkleTree service
    const hash = Object.keys(document)[0];
    return hash;
  }
}
