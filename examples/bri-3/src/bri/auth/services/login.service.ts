import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class LoginService {
  async verify(message: string, signature: string, publicKey: string) {
    return ethers.utils.verifyMessage(message, signature) === publicKey;
  }
}
