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
import { CreateWorkgroupCommand } from '../capabilities/createWorkgroup/createWorkgroup.command';
import { DeleteWorkgroupCommand } from '../capabilities/deleteWorkgroup/deleteWorkgroup.command';
import { GetWorkgroupByIdQuery } from '../capabilities/getWorkgroupById/getWorkgroupById.query';
import { UpdateWorkgroupCommand } from '../capabilities/updateWorkgroup/updateWorkgroup.command';
import { CreateWorkgroupDto } from './dtos/request/createWorkgroup.dto';
import { UpdateWorkgroupDto } from './dtos/request/updateWorkgroup.dto';
import { WorkgroupDto } from './dtos/response/workgroup.dto';

@Controller('workgroups')
export class WorkgroupController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get('/:id')
  async getWorkgroupById(@Param('id') id: string): Promise<WorkgroupDto> {
    return await this.queryBus.execute(new GetWorkgroupByIdQuery(id));
  }

  @Post()
  async createWorkgroup(
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
      new UpdateWorkgroupCommand(
        id,
        requestDto.name,
        requestDto.administratorIds,
        requestDto.securityPolicy,
        requestDto.privacyPolicy,
        requestDto.participantIds,
      ),
    );
  }

  @Delete('/:id')
  async deleteWorkgroupCommand(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteWorkgroupCommand(id));
  }
}
