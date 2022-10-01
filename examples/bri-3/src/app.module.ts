import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IdentityModule } from './bri/identity/identity.module';
import { TransactionsModule } from './bri/transactions/transactions.module';
import { WorkgroupModule } from './bri/workgroup/workgroup.module';

@Module({
  imports: [IdentityModule, WorkgroupModule, TransactionsModule],
  providers: [PrismaService],
})
export class AppModule {}
