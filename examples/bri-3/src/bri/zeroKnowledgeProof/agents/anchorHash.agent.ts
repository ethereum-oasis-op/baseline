import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { v4 } from 'uuid';
import { INVALID_ANCHOR_HASH_INPUT } from '../api/err.messages';
import { AnchorHash } from '../models/anchorHash';

@Injectable()
export class AnchorHashAgent {
  public throwErrorIfAnchorHashInputInvalid(
    inputForProofVerification: string,
  ): void {
    if (!inputForProofVerification) {
      throw new BadRequestException(INVALID_ANCHOR_HASH_INPUT);
    }
  }

  public hashTheStateAndCreateNewAnchorHash(
    ownerId: string,
    state: string,
  ): AnchorHash {
    const hash = this.convertTextToHash(state);

    return new AnchorHash(v4(), ownerId, hash);
  }

  public verifyAnchorHash(
    anchorHash: string,
    publicInputForProofVerification: string,
  ): boolean {
    if (anchorHash === publicInputForProofVerification) {
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
