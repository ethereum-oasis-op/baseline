import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateWorkstepCommand } from '../capabilities/createWorkstep/createWorkstep.command';
import { Workstep } from '../models/workstep';
import { CreateWorkstepDto } from './dtos/request/createWorkstep.dto';
import { UpdateWorkstepDto } from './dtos/request/updateWorkstep.dto';
import { WorkstepDto } from './dtos/response/workstep.dto';

@Controller('worksteps')
export class WorkstepController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  // TODO: DTO validation
  // TODO: Response DTOs
  // TODO: DTO -> Command mapping
  @Post()
  async CreateWorkstep(@Body() requestDto: CreateWorkstepDto): Promise<Workstep> {
    return await this.commandBus.execute(
      new CreateWorkstepCommand(
        requestDto.name,
        requestDto.version,
        requestDto.status,
        requestDto.workgroupId,
      )
    );
  }

  @Put()
  async updateWorkstep(@Body() requestDto: UpdateWorkstepDto): Promise<Workstep> {
    //TODO WIP
    return await this.commandBus.execute(
      new CreateWorkstepCommand(
        requestDto.name,
        requestDto.version,
        requestDto.status,
        requestDto.workgroupId,
      )
    );
  }

  @Get('/:id')
  async getWorkstepById(@Param('id') id: string): Promise<WorkstepDto> {
    return await this.queryBus.execute(new GetWorkstepByIdQuery(id));
  }
}
