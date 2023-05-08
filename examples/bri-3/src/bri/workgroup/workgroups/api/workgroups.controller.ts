import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateWorkgroupCommand } from '../capabilities/createWorkgroup/createWorkgroup.command';
import { DeleteWorkgroupCommand } from '../capabilities/deleteWorkgroup/deleteWorkgroup.command';
import { GetWorkgroupByIdQuery } from '../capabilities/getWorkgroupById/getWorkgroupById.query';
import { UpdateWorkgroupCommand } from '../capabilities/updateWorkgroup/updateWorkgroup.command';
import { ArchiveWorkgroupCommand } from '../capabilities/archiveWorkgroup/archiveWorkgroup.command';
import { CreateWorkgroupDto } from './dtos/request/createWorkgroup.dto';
import { UpdateWorkgroupDto } from './dtos/request/updateWorkgroup.dto';
import { WorkgroupDto } from './dtos/response/workgroup.dto';
import { CheckAuthz } from '../../../authz/guards/authz.decorator';

@Controller('workgroups')
export class WorkgroupController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get('/:id')
  @CheckAuthz({ action: 'read', type: 'Workgroup' })
  async getWorkgroupById(@Param('id') id: string): Promise<WorkgroupDto> {
    return await this.queryBus.execute(new GetWorkgroupByIdQuery(id));
  }

  @Post()
  @CheckAuthz({ action: 'create', type: 'Workgroup' })
  async createWorkgroup(
    @Req() req,
    @Body() requestDto: CreateWorkgroupDto,
  ): Promise<string> {
    return await this.commandBus.execute(
      new CreateWorkgroupCommand(
        req.bpiSubject,
        requestDto.name,
        requestDto.securityPolicy,
        requestDto.privacyPolicy, //TODO Implement privacy policy #573
        requestDto.workstepIds,
        requestDto.workflowIds,
      ),
    );
  }

  @Put('/:id')
  @CheckAuthz({ action: 'update', type: 'Workgroup' })
  async updateWorkgroup(
    @Param('id') id: string,
    @Body() requestDto: UpdateWorkgroupDto,
  ): Promise<WorkgroupDto> {
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

  @Put('archive/:id')
  @CheckAuthz({ action: 'delete', type: 'Workgroup' })
  async archiveWorkgroup(@Param('id') id: string): Promise<WorkgroupDto> {
    return await this.commandBus.execute(new ArchiveWorkgroupCommand(id));
  }

  @Delete('/:id')
  @CheckAuthz({ action: 'delete', type: 'Workgroup' })
  async deleteWorkgroup(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteWorkgroupCommand(id));
  }
}
