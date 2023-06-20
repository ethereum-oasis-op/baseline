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
import { CreateBpiMessageCommand } from '../capabilities/createBpiMessage/createBpiMessage.command';
import { DeleteBpiMessageCommand } from '../capabilities/deleteBpiMessage/deleteBpiMessage.command';
import { GetBpiMessageByIdQuery } from '../capabilities/getBpiMessageById/getBpiMessageById.query';
import { UpdateBpiMessageCommand } from '../capabilities/updateBpiMessage/updateBpiMessage.command';
import { CreateBpiMessageDto } from './dtos/request/createBpiMessage.dto';
import { UpdateBpiMessageDto } from './dtos/request/updateBpiMessage.dto';
import { BpiMessageDto } from './dtos/response/bpiMessage.dto';

@Controller('messages')
export class MessageController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get('/:id')
  async getBpiMessageById(@Param('id') id: string): Promise<BpiMessageDto> {
    return await this.queryBus.execute(new GetBpiMessageByIdQuery(id));
  }

  @Post()
  async createBpiMessage(
    @Body() requestDto: CreateBpiMessageDto,
  ): Promise<string> {
    return await this.commandBus.execute(
      new CreateBpiMessageCommand(
        requestDto.id,
        requestDto.from,
        requestDto.to,
        requestDto.content,
        requestDto.signature,
        requestDto.type,
      ),
    );
  }

  @Put('/:id')
  async updateBpiMessage(
    @Param('id') id: string,
    @Body() requestDto: UpdateBpiMessageDto,
  ): Promise<BpiMessageDto> {
    return await this.commandBus.execute(
      new UpdateBpiMessageCommand(id, requestDto.content, requestDto.signature),
    );
  }

  @Delete('/:id')
  async deleteBpiMessage(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteBpiMessageCommand(id));
  }
}
