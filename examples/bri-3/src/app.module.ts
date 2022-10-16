import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { pojos } from '@automapper/pojos';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IdentityModule } from './bri/identity/identity.module';
import { TransactionModule } from './bri/transactions/transactions.module';
import { WorkgroupModule } from './bri/workgroup/workgroups.module';

@Module({
  imports: [
    AutomapperModule.forRoot([
      {
        name: 'classes',
        strategyInitializer: classes(),
      },
      {
        name: 'pojos',
        strategyInitializer: pojos(),
      },
    ]),
    IdentityModule,
    WorkgroupModule,
    TransactionModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
