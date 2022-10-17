import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { WorkgroupsModule } from './workgroups/workgroups.module';

@Module({
  imports: [WorkgroupsModule],
=======
import { WorkstepModule } from './worksteps/worksteps.module';
import { WorkflowModule } from './workflows/workflows.module';

@Module({
  imports: [WorkstepModule, WorkflowModule],
>>>>>>> 1939d3b1198d0b95811f7f20e25f7df6dcbb8421
})
export class WorkgroupModule {}
