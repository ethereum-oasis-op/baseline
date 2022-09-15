import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateWorkstepCommand } from '../capabilities/createWorkstep/createWorkstep.command';
import { GetWorkstepByIdQuery } from '../capabilities/getWorkstepById/getWorkstepById.query';
import { UpdateWorkstepCommand } from '../capabilities/updateWorkstep/updateWorkstep.command';
import { CreateWorkstepDto } from './dtos/request/createWorkstep.dto';
import { UpdateWorkstepDto } from './dtos/request/updateWorkstep.dto';
import { WorkstepDto } from './dtos/response/workstep.dto';

@Controller('worksteps')
export class WorkstepController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  // TODO: DTO validation
  // TODO: Response DTOs
  // TODO: DTO -> Command mapping
  @Get('/:id')
  async getWorkstepById(@Param('id') id: string): Promise<WorkstepDto> {
    return await this.queryBus.execute(new GetWorkstepByIdQuery(id));
  }

  @Get()
  async getAllWorksteps(): Promise<WorkstepDto[]> {
    return await this.queryBus.execute(new GetAllWorkstepsQuery());
  }

  @Post()
  async createWorkstep(@Body() requestDto: CreateWorkstepDto): Promise<string> {
    return await this.commandBus.execute(
      new CreateWorkstepCommand(
        requestDto.name,
        requestDto.version,
        requestDto.status,
        requestDto.workgroupId,
        requestDto.securityPolicy,
        requestDto.privacyPolicy,
      )
    );
  }

  @Put('/:id')
  async updateWorkstep(@Param('id') id: string, @Body() requestDto: UpdateWorkstepDto): Promise<void> {
    return await this.commandBus.execute(
      new UpdateWorkstepCommand(
        id,
        requestDto.name,
        requestDto.version,
        requestDto.status,
        requestDto.workgroupId,
        requestDto.securityPolicy,
        requestDto.privacyPolicy
      )
    );
  }
}
