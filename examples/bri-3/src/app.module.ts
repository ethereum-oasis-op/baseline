import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommunicationModule } from './bri/communication/communication.module';
import { IdentityModule } from './bri/identity/identity.module';
import { TransactionModule } from './bri/transactions/transactions.module';
import { WorkgroupModule } from './bri/workgroup/workgroups.module';
import { LoggingModule } from './shared/logging/logging.module';

@Module({
  imports: [
    IdentityModule,
    WorkgroupModule,
    TransactionModule,
    CommunicationModule,
    LoggingModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
