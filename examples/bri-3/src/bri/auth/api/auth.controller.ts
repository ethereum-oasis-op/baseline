import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Public } from '../../decorators/public-endpoint';
import { GenerateNonceCommand } from '../capabilities/generateNonce/generateNonceCommand';
import { LoginCommand } from '../capabilities/login/login.command';
import { GenerateNonceDto } from './dto/request/generate.nonce.dto';
import { LoginDto } from './dto/request/login.dto';

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
