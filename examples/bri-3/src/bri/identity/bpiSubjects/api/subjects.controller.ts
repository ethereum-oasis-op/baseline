import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBpiSubjectCommand } from '../capabilities/createBpiSubject/createBpiSubject.command';
import { GetBpiSubjectByIdQuery } from '../capabilities/getBpiSubjectById/getBpiSubjectById.query';
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
  async createBpiSubject(@Body() requestDto: CreateBpiSubjectDto): Promise<BpiSubject> {
    return await this.commandBus.execute(
      new CreateBpiSubjectCommand(
            requestDto.name, 
            requestDto.desc, 
            requestDto.publicKey
        )
      );
  }

  @Put()
  async updateBpiSubject(@Body() requestDto: UpdateBpiSubjectDto): Promise<BpiSubject> {
    // TODO: WIP
    return await this.commandBus.execute(new CreateBpiSubjectCommand(requestDto.name, requestDto.desc, requestDto.publicKey));
  }

  @Get('/:id')
  async getBpiSubjectById(@Param('id') id: string): Promise<BpiSubjectDto> {
    return await this.queryBus.execute(new GetBpiSubjectByIdQuery(id));
  }
}
