import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginService } from './login.service';
import { SubjectModule } from '../../identity/bpiSubjects/subjects.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, LoginService, JwtService],
      imports: [
        SubjectModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
