import * as crypto from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { INVALID_ANCHOR_HASH_INPUT } from '../api/err.messages';
import { v4 as uuidv4 } from 'uuid';
import { CCSMAnchorHash } from '../models/ccsmAnchorHash';
import { Document } from '../models/document';

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
    document: Document,
  ): CCSMAnchorHash {
    const hash = this.convertTextToHash(document.text);

    return new CCSMAnchorHash(uuidv4(), ownerId, hash, document.id);
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
    return this.convertTextToHash(inputForProofVerification);
  }

  public convertTextToHash(text: string) {
    const hash = crypto.createHash('sha256').update(text).digest('base64');
    return hash;
  }
}
