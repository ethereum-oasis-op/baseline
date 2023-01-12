import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Headers } from '@nestjs/common/decorators';
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
    @Headers('authorization') accessToken: string, //TODO replace with JWT type from its module
  ): Promise<string> {
    return await this.commandBus.execute(
      new CreateWorkgroupCommand(
        accessToken,
        requestDto.name,
        requestDto.securityPolicy, //TODO will be made default once secPolicy Implemented
        requestDto.privacyPolicy, //TODO will be made default once priPolicy Implemented
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
  async deleteWorkgroup(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteWorkgroupCommand(id));
  }
}
