import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers';
import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectStorageAgent } from '../../../bri/identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { createJWT, ES256KSigner, hexToBytes } from 'did-jwt';

@Injectable()
export class AuthAgent {
  constructor(
    private readonly bpiSubjectStorageAgent: BpiSubjectStorageAgent,
    private jwtService: JwtService,
  ) {}

  verify(message: string, signature: string, publicKey: string) {
    const utilsVerify = ethers.utils.verifyMessage(message, signature);
    return utilsVerify.toLowerCase() === publicKey;
  }

  async getBpiSubjectByPublicKey(publicKey: string) {
    return this.bpiSubjectStorageAgent.getBpiSubjectByPublicKey(publicKey);
  }

  async updateLoginNonce(bpiSubject: BpiSubject) {
    bpiSubject.updateLoginNonce();
    return this.bpiSubjectStorageAgent.updateBpiSubject(bpiSubject);
  }

  async generateJwt(payload: any) {
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  async generateDidJwt(payload: any) {
    const serviceDid = process.env.GOERLI_SERVICE_DID;
    const privateKey = process.env.GEORLI_SERVICE_SIGNER_PRIVATE_KEY;
    const serviceSigner = ES256KSigner(hexToBytes(privateKey));
    const access_token = await createJWT(
      payload,
      { issuer: serviceDid, signer: serviceSigner },
      { typ: 'JWT', alg: 'ES256K' },
    );

    return { access_token };
  }
}
