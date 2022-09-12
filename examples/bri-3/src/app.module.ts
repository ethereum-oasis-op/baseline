import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IdentityModule } from './bri/identity/identity.module';
import { WorkgroupModule } from './bri/workgroup/workgroup.module';

@Module({
  imports: [IdentityModule, WorkgroupModule],
  providers: [PrismaService],
})
export class AppModule {}
