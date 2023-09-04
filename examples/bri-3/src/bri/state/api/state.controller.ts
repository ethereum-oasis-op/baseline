import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetStateContentQuery } from '../capabilities/getStateContent/getStateContent.query';

@Controller('state')
export class StateController {
  constructor(private queryBus: QueryBus) {}

  @Get('/')
  async getLeaveValueContent(
    @Query('leafValue') leafValue: string,
  ): Promise<boolean> {
    return await this.queryBus.execute(new GetStateContentQuery(leafValue));
  }
}
