import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateWorkflowCommand } from '../capabilities/createWorkflow/createWorkflow.command';
import { Workflow } from '../models/workflow';
import { CreateWorkflowDto } from './dtos/request/createWorkflow.dto';

@Controller('workflows')
export class WorkflowController {
  constructor(private commandBus: CommandBus) {}

  // TODO: DTO validation
  // TODO: Response DTOs
  // TODO: DTO -> Command mapping
  @Post()
  async CreateWorkflow(
    @Body() requestDto: CreateWorkflowDto,
  ): Promise<Workflow> {
    return await this.commandBus.execute(
      new CreateWorkflowCommand(requestDto.worksteps),
    );
  }
}
