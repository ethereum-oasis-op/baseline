import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './api/auth.controller';
import { SubjectModule } from '../identity/bpiSubjects/subjects.module';
import { AuthAgent } from './agent/auth.agent';
import { GenerateNonceCommandHandler } from './capabilities/generateNonce/generateNonceCommand.handler';
import { LoginCommandHandler } from './capabilities/login/login.command.handler';
import { CqrsModule } from '@nestjs/cqrs';

export const CommandHandlers = [
  GenerateNonceCommandHandler,
  LoginCommandHandler,
];

@Module({
  imports: [CqrsModule, PassportModule, JwtModule, SubjectModule],
  controllers: [AuthController],
  providers: [...CommandHandlers, AuthAgent],
  exports: [],
})
export class AuthModule {}
