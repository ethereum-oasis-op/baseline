import { Module } from '@nestjs/common';
import { WorkstepModule } from './worksteps/worksteps.module';

@Module({
  imports: [WorkstepModule],
})
export class WorkgroupModule {}
