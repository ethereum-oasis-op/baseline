import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthAccesorService } from '../agents/authAccessor.agent';
import { errorMessage } from '../constants';
import { Login } from '../model/login';
import { LoginService } from './login.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authAccesorService: AuthAccesorService,
    private jwtService: JwtService,
    private readonly loginService: LoginService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.authAccesorService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(input: Login | any) {
    const { message, signature, publicKey } = input;
    if (this.loginService.verify(message, signature, publicKey)) {
      const dbUser = await this.authAccesorService.findOne(input.publicKey);
      const payload = { username: dbUser.name, sub: dbUser.id };
      const access_token = this.jwtService.sign(payload);
      return { access_token };
    }
    throw new Error(errorMessage.USER_NOT_AUTHORIZED);
  }
}
