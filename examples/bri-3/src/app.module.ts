import { Module } from '@nestjs/common';
import { IdentityModule } from './bri/identity/identity.module';

@Module({
  imports: [IdentityModule],
})
export class AppModule {}
