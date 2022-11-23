import { BadRequestException, Injectable } from '@nestjs/common';
import { INVALID_ANCHOR_HASH_INPUT } from '../api/err.messages';
import { v4 as uuidv4 } from 'uuid';
import { CCSMAnchorHash } from '../models/ccsmAnchorHash';

@Injectable()
export class CCSMAnchorHashAgent {
  public throwErrorIfCCSMAnchorHashInputInvalid(
    inputForProofVerification: string,
  ): void {
    if (!inputForProofVerification) {
      throw new BadRequestException(INVALID_ANCHOR_HASH_INPUT);
    }
  }

  public createNewCCSMAnchorHash(
    ownerId: string,
    document: string,
  ): CCSMAnchorHash {
    const hash = this.convertDocumentToHash(document);

    return new CCSMAnchorHash(uuidv4(), ownerId, hash);
  }

  public verifyCCSMAnchorHash(
    CCSMAnchorHash: string,
    publicInputForProofVerification: string,
  ): boolean {
    if (CCSMAnchorHash === publicInputForProofVerification) {
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
