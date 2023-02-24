import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoggingModule } from '../../shared/logging/logging.module';
import { SubjectModule } from '../identity/bpiSubjects/subjects.module';
import { AuthAgent } from './agent/auth.agent';
import { AuthController } from './api/auth.controller';
import { GenerateNonceCommandHandler } from './capabilities/generateNonce/generateNonceCommand.handler';
import { LoginCommandHandler } from './capabilities/login/login.command.handler';

export const CommandHandlers = [
  GenerateNonceCommandHandler,
  LoginCommandHandler,
];

@Module({
  imports: [CqrsModule, PassportModule, JwtModule, SubjectModule, LoggingModule],
  controllers: [AuthController],
  providers: [...CommandHandlers, AuthAgent],
  exports: [AuthAgent],
})
export class AuthModule {}
