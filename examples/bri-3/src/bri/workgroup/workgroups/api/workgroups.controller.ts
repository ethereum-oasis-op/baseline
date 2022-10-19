import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateWorkgroupCommand } from '../capabilities/createWorkgroup/createWorkgroup.command';
import { GetWorkgroupByIdQuery } from '../capabilities/getWorkgroupById/getWorkgroupById.query';
import { Workgroup } from '../models/workgroup';
import { CreateWorkgroupDto } from './dtos/request/createWorkgroup.dto';
import { UpdateWorkgroupDto } from './dtos/request/updateWorkgroup.dto';
import { WorkgroupDto } from './dtos/response/workgroup.dto';

@Controller('workgroups')
export class WorkgroupController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  // TODO: DTO validation
  // TODO: Response DTOs
  // TODO: DTO -> Command mapping
  @Post()
  async CreateWorkgroup(
    @Body() requestDto: CreateWorkgroupDto,
  ): Promise<Workgroup> {
    return await this.commandBus.execute(
      new CreateWorkgroupCommand(
        requestDto.name,
        requestDto.administratorIds,
        requestDto.securityPolicy,
        requestDto.privacyPolicy,
        requestDto.parcitipantIds,
        requestDto.workstepIds,
        requestDto.workflowIds,
      ),
    );
  }

  @Put()
  async updateWorkgroup(
    @Body() requestDto: UpdateWorkgroupDto,
  ): Promise<Workgroup> {
    //TODO: WIP
    return await this.commandBus.execute(
      new CreateWorkgroupCommand(
        requestDto.name,
        requestDto.administratorIds,
        requestDto.securityPolicy,
        requestDto.privacyPolicy,
        requestDto.parcitipantIds,
        requestDto.workstepIds,
        requestDto.workflowIds,
      ),
    );
  }

  @Get('/:id')
  async getworkgroupById(@Param('id') id: string): Promise<WorkgroupDto> {
    return await this.queryBus.execute(new GetWorkgroupByIdQuery(id));
  }
}
