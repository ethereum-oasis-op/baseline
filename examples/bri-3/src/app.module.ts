import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IdentityModule } from './bri/identity/identity.module';
import { TransactionModule } from './bri/transactions/transactions.module';
import { WorkgroupModule } from './bri/workgroup/workgroups.module';

@Module({
  imports: [IdentityModule, WorkgroupModule, TransactionModule],
  providers: [PrismaService],
})
export class AppModule {}
