import { Module } from '@nestjs/common';
import { WorkgroupsModule } from './workgroups/workgroups.module';

@Module({
  imports: [WorkgroupsModule],
})
export class WorkgroupModule {}
