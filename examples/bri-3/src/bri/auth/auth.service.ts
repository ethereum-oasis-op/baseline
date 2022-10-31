import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthAccesorService } from './agents/authAccessor.agent';

@Injectable()
export class AuthService {
  constructor(
    private readonly authAccesorService: AuthAccesorService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.authAccesorService.findOne(username);
    console.log(user);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const access_token = this.jwtService.sign(payload);
    console.log(access_token);
    return { access_token };
  }
}
