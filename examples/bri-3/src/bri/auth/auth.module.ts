import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './api/auth.controller';
import { AuthService } from './services/auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LoginService } from './services/login.service';
import { SubjectModule } from '../identity/bpiSubjects/subjects.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    SubjectModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LoginService],
  exports: [AuthService],
})
export class AuthModule {}
