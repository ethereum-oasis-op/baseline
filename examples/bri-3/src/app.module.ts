import { Module } from '@nestjs/common';
import { IdentityModule } from './bri/identity/identity.module';
import { WorkgroupModule } from './bri/workgroup/workgroup.module';

@Module({
  imports: [IdentityModule, WorkgroupModule],
})
export class AppModule {}
