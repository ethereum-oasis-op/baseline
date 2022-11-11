import { Controller, Get, Post, Request } from '@nestjs/common';
import { Public } from 'src/bri/decorators/public-endpoint';
import { AuthService } from '../services/auth.service';
import { generateMnemonic } from 'bip39';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @Public()
  @Get('mnemonic')
  async mnemonic(@Request() req) {
    return generateMnemonic();
  }
}
