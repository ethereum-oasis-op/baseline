import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBpiSubjectCommand } from '../capabilities/createBpiSubject/createBpiSubject.command';
import { DeleteBpiSubjectCommand } from '../capabilities/deleteBpiSubject/deleteBpiSubject.command';
import { GetBpiSubjectByIdQuery } from '../capabilities/getBpiSubjectById/getBpiSubjectById.query';
import { UpdateBpiSubjectCommand } from '../capabilities/updateBpiSubject/updateBpiSubject.command';
import { BpiSubject } from '../models/bpiSubject';
import { CreateBpiSubjectDto } from './dtos/request/createBpiSubject.dto';
import { UpdateBpiSubjectDto } from './dtos/request/updateBpiSubject.dto';

import { BpiSubjectDto } from './dtos/response/bpiSubject.dto';

@Controller("subjects")
export class SubjectController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  // TODO: DTO validation
  // TODO: Response DTOs
  // TODO: DTO -> Command mapping
  @Post()
  async createBpiSubject(@Body() requestDto: CreateBpiSubjectDto): Promise<string> {
    return await this.commandBus.execute(
      new CreateBpiSubjectCommand(
            requestDto.name, 
            requestDto.desc, 
            requestDto.publicKey
        )
      );
  }

  @Put()
  async updateBpiSubject(@Body() requestDto: UpdateBpiSubjectDto): Promise<void> {
    return await this.commandBus.execute(
      new UpdateBpiSubjectCommand(
        requestDto.id,
        requestDto.name, 
        requestDto.desc, 
        requestDto.publicKey));
  }

  @Delete('/:id')
  async deleteBpiSubject(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteBpiSubjectCommand(id));
  }

  @Get('/:id')
  async getBpiSubjectById(@Param('id') id: string): Promise<BpiSubjectDto> {
    return await this.queryBus.execute(new GetBpiSubjectByIdQuery(id));
  }
}
