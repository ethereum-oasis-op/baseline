import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createJWT, ES256KSigner, hexToBytes } from 'did-jwt';
import { ethers } from 'ethers';
import { BpiSubjectStorageAgent } from '../../../bri/identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { BpiSubject } from '../../../bri/identity/bpiSubjects/models/bpiSubject';
import { LoggingService } from '../../../shared/logging/logging.service';
import { errorMessage, jwtConstants } from '../constants';

@Injectable()
export class AuthAgent {
  constructor(
    private readonly bpiSubjectStorageAgent: BpiSubjectStorageAgent,
    private readonly jwtService: JwtService,
    private readonly logger: LoggingService,
  ) {}

  // TODO: Move into a separate service once signature verification
  // capabilities grow
  throwIfSignatureVerificationFails(
    message: string,
    signature: string,
    publicKey: string,
  ): void {
    if (!this.verifySignatureAgainstPublicKey(message, signature, publicKey)) {
      throw new Error(errorMessage.USER_NOT_AUTHORIZED);
    }
  }

  verifySignatureAgainstPublicKey(
    message: string,
    signature: string,
    publicKey: string,
  ): boolean {
    const publicKeyFromSignature = ethers.utils.verifyMessage(
      message,
      signature,
    );

    const isValid = publicKeyFromSignature === publicKey;

    if (!isValid) {
      this.logger.logWarn(`Signature: ${signature} invalid.`);
    }

    return isValid;
  }

  async getBpiSubjectByPublicKey(publicKey: string) {
    return this.bpiSubjectStorageAgent.getBpiSubjectByPublicKey(publicKey);
  }

  throwIfLoginNonceMismatch(bpiSubject: BpiSubject, nonce: string) {
    if (bpiSubject.loginNonce !== nonce) {
      throw new Error(errorMessage.USER_NOT_AUTHORIZED);
    }
  }

  async updateLoginNonce(bpiSubject: BpiSubject) {
    bpiSubject.updateLoginNonce();
    return this.bpiSubjectStorageAgent.updateBpiSubject(bpiSubject);
  }

  async generateJwt(payload: any) {
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  async generateDidJwt(bpiSubject: BpiSubject) {
    const serviceUrl = process.env.SERVICE_URL;
    const now = Math.floor(Date.now() / 1000);

    const didJwtPayload = {
      aud: serviceUrl,
      sub: bpiSubject.getBpiSubjectDid(),
      exp: now + Math.floor(jwtConstants.expiresIn / 1000),
      nbf: now,
      iat: now,
    };

    const serviceDid = process.env.GOERLI_SERVICE_DID;
    const privateKey = process.env.GEORLI_SERVICE_SIGNER_PRIVATE_KEY;

    const serviceSigner = ES256KSigner(hexToBytes(privateKey));

    const access_token = await createJWT(
      didJwtPayload,
      { issuer: serviceDid, signer: serviceSigner },
      { typ: 'JWT', alg: 'ES256K' },
    );

    return { access_token };
  }
}
