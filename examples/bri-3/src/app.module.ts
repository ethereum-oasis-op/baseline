import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommunicationModule } from './bri/communication/communication.module';
import { IdentityModule } from './bri/identity/identity.module';
import { TransactionModule } from './bri/transactions/transactions.module';
import { WorkgroupsModule } from './bri/workgroup/workgroup.module';
import { LoggingModule } from './shared/logging/logging.module';
import { AuthModule } from './bri/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './bri/auth/guards/sri-jwt.guard';

@Module({
  imports: [
    IdentityModule,
    WorkgroupsModule,
    TransactionModule,
    CommunicationModule,
    LoggingModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    AuthModule,
  ],
  providers: [
    PrismaService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
