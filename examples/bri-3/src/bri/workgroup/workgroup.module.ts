import { Module } from '@nestjs/common';
import { WorkstepsModule } from './worksteps/worksteps.module';
import { WorkflowsModule } from './workflows/workflows.module';

@Module({
  imports: [WorkstepsModule, WorkflowsModule],
})
export class WorkgroupModule {}
