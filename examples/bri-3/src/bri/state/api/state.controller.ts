import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetStateTreeLeafValueContentQuery } from '../capabilities/getStateContent/getStateTreeLeafValueContent.query';

@Controller('state')
export class StateController {
  constructor(private queryBus: QueryBus) {}

  @Get('/')
  async getStateTreeLeafValueContent(
    @Query('leafValue') leafValue: string,
  ): Promise<boolean> {
    return await this.queryBus.execute(
      new GetStateTreeLeafValueContentQuery(leafValue),
    );
  }
}
