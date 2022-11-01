import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommunicationModule } from './bri/communication/communication.module';
import { IdentityModule } from './bri/identity/identity.module';
import { TransactionModule } from './bri/transactions/transactions.module';
import { WorkgroupModule } from './bri/workgroup/workgroup.module';
import { ProofModule } from './bri/zkp/zkp.module';

@Module({
  imports: [
    IdentityModule,
    WorkgroupModule,
    TransactionModule,
    CommunicationModule,
    ProofModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
