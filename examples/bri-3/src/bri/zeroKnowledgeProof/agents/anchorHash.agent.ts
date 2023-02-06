import * as crypto from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  INVALID_ANCHOR_HASH_INPUT,
  INVALID_SIGNATURE,
} from '../api/err.messages';
import { v4 as uuidv4 } from 'uuid';
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

  public throwErrorIfSignatureIsInvalid(signature: string): void {
    if (!signature) {
      throw new BadRequestException(INVALID_SIGNATURE);
    }
  }

  public hashTheStateAndCreateNewAnchorHash(
    ownerId: string,
    state: string,
    signature: string,
  ): AnchorHash {
    const hash = this.convertTextToHash(state);

    return new AnchorHash(uuidv4(), ownerId, hash, signature);
  }

  public verifyAnchorHash(
    anchorHash: string,
    publicInputForProofVerification: string,
    signature: string,
  ): boolean {
    if (anchorHash === publicInputForProofVerification && signature) {
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
