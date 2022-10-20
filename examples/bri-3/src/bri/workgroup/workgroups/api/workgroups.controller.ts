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
import { DeleteWorkflowCommand } from '../../workflows/capabilities/deleteWorkflow/deleteWorkflow.command';
import { CreateWorkgroupCommand } from '../capabilities/createWorkgroup/createWorkgroup.command';
import { GetWorkgroupByIdQuery } from '../capabilities/getWorkgroupById/getWorkgroupById.query';
import { Workgroup } from '../models/workgroup';
import { CreateWorkgroupDto } from './dtos/request/createWorkgroup.dto';
import { UpdateWorkgroupDto } from './dtos/request/updateWorkgroup.dto';
import { WorkgroupDto } from './dtos/response/workgroup.dto';

@Controller('workgroups')
export class WorkgroupController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get('/:id')
  async getworkgroupById(@Param('id') id: string): Promise<WorkgroupDto> {
    return await this.queryBus.execute(new GetWorkgroupByIdQuery(id));
  }

  @Post()
  async CreateWorkgroup(
    @Body() requestDto: CreateWorkgroupDto,
  ): Promise<string> {
    return await this.commandBus.execute(
      new CreateWorkgroupCommand(
        requestDto.name,
        requestDto.administratorIds,
        requestDto.securityPolicy,
        requestDto.privacyPolicy,
        requestDto.participantIds,
        requestDto.workstepIds,
        requestDto.workflowIds,
      ),
    );
  }

  @Put('/:id')
  async updateWorkgroup(
    @Param('id') id: string,
    @Body() requestDto: UpdateWorkgroupDto,
  ): Promise<void> {
    return await this.commandBus.execute(
      new CreateWorkgroupCommand(
        requestDto.name,
        requestDto.administratorIds,
        requestDto.securityPolicy,
        requestDto.privacyPolicy,
        requestDto.participantIds,
        requestDto.workstepIds,
        requestDto.workflowIds,
      ),
    );
  }

  @Delete('/:id')
  async DeleteWorkflowCommand(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteWorkflowCommand(id));
  }
}
