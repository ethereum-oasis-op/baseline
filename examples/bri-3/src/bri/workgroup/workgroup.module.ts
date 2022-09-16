import { Module } from '@nestjs/common';
import { WorkstepsModule } from './worksteps/worksteps.module';

@Module({
  imports: [WorkstepsModule]
})
export class WorkgroupModule {}
