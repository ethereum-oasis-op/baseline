import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { errorMessage } from '../constants';
import { LoginDto } from '../model/login.dto';
import { LoginService } from './login.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly loginService: LoginService,
    private readonly bpiSubjectStorageAgent: BpiSubjectStorageAgent,
  ) {}

  async login(input: LoginDto | any) {
    const { message, signature, publicKey } = input;
    if (this.loginService.verify(message, signature, publicKey)) {
      const dbUser = await this.bpiSubjectStorageAgent.getByPublicKey(
        input.publicKey,
      );
      const payload = { username: dbUser.name, sub: dbUser.id };
      const access_token = this.jwtService.sign(payload);
      return { access_token };
    }
    throw new Error(errorMessage.USER_NOT_AUTHORIZED);
  }
}
