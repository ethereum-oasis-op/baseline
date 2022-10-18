import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommunicationModule } from './bri/communication/communication.module';
import { IdentityModule } from './bri/identity/identity.module';
import { TransactionModule } from './bri/transactions/transactions.module';
import { WorkgroupsModule } from './bri/workgroup/workgroup.module';

@Module({
  imports: [
    IdentityModule,
    WorkgroupsModule,
    TransactionModule,
    CommunicationModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
