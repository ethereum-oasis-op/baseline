import { Module } from '@nestjs/common';
import { WorkstepModule } from './worksteps/worksteps.module';
import { WorkflowModule } from './workflows/workflows.module';

@Module({
  imports: [WorkstepModule, WorkflowModule],
})
export class WorkgroupModule {}
