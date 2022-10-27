import { Module } from '@nestjs/common';
import { WorkstepModule } from './worksteps/worksteps.module';
import { WorkflowModule } from './workflows/workflows.module';
import { WorkgroupModule } from './workgroups/workgroups.module';

@Module({
  imports: [WorkstepModule, WorkflowModule, WorkgroupModule],
})
export class WorkgroupsModule {}
