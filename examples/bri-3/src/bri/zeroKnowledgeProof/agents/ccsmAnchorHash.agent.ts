import { BadRequestException, Injectable } from '@nestjs/common';
import { INVALID_ANCHOR_HASH_INPUT } from '../api/err.messages';
import { v4 as uuidv4 } from 'uuid';
import { CcsmAnchorHash } from '../models/ccsmAnchorHash';

@Injectable()
export class CcsmAnchorHashAgent {
  public throwErrorIfCcsmAnchorHashInputInvalid(
    inputForProofVerification: string,
  ): void {
    if (!inputForProofVerification) {
      throw new BadRequestException(INVALID_ANCHOR_HASH_INPUT);
    }
  }

  public createNewCcsmAnchorHash(
    ownerId: string,
    document: string,
  ): CcsmAnchorHash {
    const hash = this.convertDocumentToHash(document);

    return new CcsmAnchorHash(uuidv4(), ownerId, hash);
  }

  public verifyCcsmAnchorHash(
    CcsmAnchorHash: string,
    publicInputForProofVerification: string,
  ): boolean {
    if (CcsmAnchorHash === publicInputForProofVerification) {
      return true;
    }

    return false;
  }

  public createPublicInputForProofVerification(
    inputForProofVerification: string,
  ): string {
    const hash = this.convertDocumentToHash(inputForProofVerification);
    const publicInputForProofVerification = hash;
    return publicInputForProofVerification;
  }

  public convertDocumentToHash(document: string) {
    //TODO: Convert document into payload using merkleTree service
    const hash = document;
    return hash;
  }
}
