import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers';
import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectStorageAgent } from '../../../bri/identity/bpiSubjects/agents/bpiSubjectsStorage.agent';

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
    return this.bpiSubjectStorageAgent.getByPublicKey(publicKey);
  }

  async updateLoginNonce(bpiSubject: BpiSubject) {
    return this.bpiSubjectStorageAgent.updateBpiSubject(bpiSubject);
  }

  async generateJwt(payload: any) {
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
