import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommunicationModule } from './bri/communication/communication.module';
import { IdentityModule } from './bri/identity/identity.module';
import { TransactionModule } from './bri/transactions/transactions.module';
import { ZeroKnowledgeProofModule } from './bri/zeroKnowledgeProof/zeroKnowledgeProof.module';
import { WorkgroupsModule } from './bri/workgroup/workgroup.module';
import { LoggingModule } from './shared/logging/logging.module';
import { AuthModule } from './bri/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { DidJwtAuthGuard } from './bri/auth/guards/didJwt.guard';
import { SubjectModule } from './bri/identity/bpiSubjects/subjects.module';
import { AuthzGuard } from './bri/authz/guards/authz.guard';
import { AuthzModule } from './bri/authz/authz.module';

@Module({
  imports: [
    IdentityModule,
    WorkgroupsModule,
    TransactionModule,
    CommunicationModule,
    ZeroKnowledgeProofModule,
    LoggingModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    AuthModule,
    AuthzModule,
    SubjectModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: DidJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthzGuard,
    },
  ],
})
export class AppModule {}
