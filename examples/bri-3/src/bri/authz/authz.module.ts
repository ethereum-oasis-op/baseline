import { Module } from '@nestjs/common';
import { AuthzFactory } from './authz.factory';

@Module({
  providers: [AuthzFactory],
  exports: [AuthzFactory],
})
export class AuthzModule {}
