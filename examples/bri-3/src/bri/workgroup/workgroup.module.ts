import { Module } from '@nestjs/common';
import { WorkflowsModule } from './workflows/workflows.module';

@Module({
  imports: [WorkflowsModule],
})
export class WorkgroupModule {}
