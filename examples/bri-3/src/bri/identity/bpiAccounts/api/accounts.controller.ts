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
import { CreateBpiAccountCommand } from '../capabilities/createBpiAccount/createBpiAccount.command';
import { DeleteBpiAccountCommand } from '../capabilities/deleteBpiAccount/deleteBpiAccount.command';
import { GetAllBpiAccountsQuery } from '../capabilities/getAllBpiAccounts/getAllBpiAccounts.query';
import { GetBpiAccountByIdQuery } from '../capabilities/getBpiAccountById/getBpiAccountById.query';
import { UpdateBpiAccountCommand } from '../capabilities/updateBpiAccount/updateBpiAccount.command';
import { CreateBpiAccountDto } from './dtos/request/createBpiAccount.dto';
import { UpdateBpiAccountDto } from './dtos/request/updateBpiAccount.dto';
import { BpiAccountDto } from './dtos/response/bpiAccount.dto';

@Controller('accounts')
export class AccountController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  // TODO: DTO validation
  // TODO: Response DTOs
  // TODO: DTO -> Command mapping
  @Get('/:id')
  async getBpiAccountById(@Param('id') id: string): Promise<BpiAccountDto> {
    return await this.queryBus.execute(new GetBpiAccountByIdQuery(id));
  }

  @Get()
  async getAllBpiAccounts(): Promise<BpiAccountDto[]> {
    return await this.queryBus.execute(new GetAllBpiAccountsQuery());
  }

  @Post()
  async createBpiAccount(
    @Body() requestDto: CreateBpiAccountDto,
  ): Promise<string> {
    return await this.commandBus.execute(
      new CreateBpiAccountCommand(requestDto.nonce),
    );
  }

  @Put('/:id')
  async updateBpiAccount(
    @Param('id') id: string,
    @Body() requestDto: UpdateBpiAccountDto,
  ): Promise<void> {
    return await this.commandBus.execute(
      new UpdateBpiAccountCommand(id, requestDto.nonce),
    );
  }

  @Delete('/:id')
  async deleteBpiAccount(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteBpiAccountCommand(id));
  }
}
