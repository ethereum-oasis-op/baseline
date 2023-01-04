import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/bri/decorators/public-endpoint';
import { CommandBus } from '@nestjs/cqrs';
import { LoginDto } from './dto/request/login.dto';
import { GenerateNonceDto } from './dto/request/generate.nonce.dto';
import { LoginCommand } from '../capabilities/login/login.command';
import { GenerateNonceCommand } from '../capabilities/generateNonce/generateNonceCommand';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.commandBus.execute(
      new LoginCommand(
        loginDto.message,
        loginDto.signature,
        loginDto.publicKey,
      ),
    );
  }

  @Public()
  @Post('nonce')
  async nonce(@Body() generateNonceDto: GenerateNonceDto) {
    return await this.commandBus.execute(
      new GenerateNonceCommand(generateNonceDto.publicKey),
    );
  }
}
