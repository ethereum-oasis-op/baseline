import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CheckAuthz } from '../../../authz/guards/authz.decorator';
import { CreateWorkflowCommand } from '../capabilities/createWorkflow/createWorkflow.command';
import { DeleteWorkflowCommand } from '../capabilities/deleteWorkflow/deleteWorkflow.command';
import { GetAllWorkflowsQuery } from '../capabilities/getAllWorkflows/getAllWorkflows.query';
import { GetWorkflowByIdQuery } from '../capabilities/getWorkflowById/getWorkflowById.query';
import { UpdateWorkflowCommand } from '../capabilities/updateWorkflow/updateWorkflow.command';
import { CreateWorkflowDto } from './dtos/request/createWorkflow.dto';
import { UpdateWorkflowDto } from './dtos/request/updateWorkflow.dto';
import { WorkflowDto } from './dtos/response/workflow.dto';

@Controller('workflows')
export class WorkflowController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get('/:id')
  @CheckAuthz({ action: 'read', type: 'Workflow' })
  async getWorkflowById(@Param('id') id: string): Promise<WorkflowDto> {
    return await this.queryBus.execute(new GetWorkflowByIdQuery(id));
  }

  @Get()
  @CheckAuthz({ action: 'read', type: 'Workflow' })
  async getAllWorkflows(): Promise<WorkflowDto[]> {
    return await this.queryBus.execute(new GetAllWorkflowsQuery());
  }

  @Post()
  @CheckAuthz({ action: 'create', type: 'Workflow' })
  async createWorkflow(@Body() requestDto: CreateWorkflowDto): Promise<string> {
    return await this.commandBus.execute(
      new CreateWorkflowCommand(
        requestDto.name,
        requestDto.workgroupId,
        requestDto.workstepIds,
      ),
    );
  }

  @Put('/:id')
  @CheckAuthz({ action: 'update', type: 'Workflow' })
  async updateWorkflow(
    @Param('id') id: string,
    @Body() requestDto: UpdateWorkflowDto,
  ): Promise<WorkflowDto> {
    return await this.commandBus.execute(
      new UpdateWorkflowCommand(
        id,
        requestDto.name,
        requestDto.workstepIds,
        requestDto.workgroupId,
      ),
    );
  }

  @Delete('/:id')
  @CheckAuthz({ action: 'delete', type: 'Workflow' })
  async deleteWorkflow(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteWorkflowCommand(id));
  }
}
