import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './api/auth.controller';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategy/jwt.strategy';
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
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    SubjectModule,
  ],
  controllers: [AuthController],
  providers: [...CommandHandlers, JwtStrategy, AuthAgent],
  exports: [],
})
export class AuthModule {}
