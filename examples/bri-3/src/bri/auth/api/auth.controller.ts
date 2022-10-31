import { Controller, Post, Request } from '@nestjs/common';
import { Public } from 'src/bri/decorators/public-endpoint';
import { AuthService } from '../auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }
}
